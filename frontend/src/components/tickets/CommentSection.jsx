import React, { useState } from 'react';
import { ticketService } from '../../services/ticketService';
import { formatRelativeTime, getErrorMessage } from '../../utils/helpers';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { MessageSquare, Send, User, Shield, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';

const CommentSection = ({ ticketId, comments = [], onCommentAdded }) => {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter a comment message before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await ticketService.addComment(ticketId, message.trim());
      toast.success('Comment posted successfully');
      setMessage('');
      if (onCommentAdded) {
        onCommentAdded(response.data);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const getRolePresentation = (role) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Admin',
          badgeVariant: 'danger',
          avatarBg: 'bg-rose-100 text-rose-700',
          icon: Shield,
        };
      case 'engineer':
        return {
          label: 'Engineer',
          badgeVariant: 'info',
          avatarBg: 'bg-blue-100 text-blue-700',
          icon: Wrench,
        };
      case 'user':
      default:
        return {
          label: 'User',
          badgeVariant: 'default',
          avatarBg: 'bg-slate-100 text-slate-700',
          icon: User,
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-brand-600" />
          <h3 className="text-base font-bold text-slate-900">
            Support Conversation ({comments.length})
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          Messages visible to submitter, assignee & admins
        </span>
      </div>

      {/* Comment Conversation Feed */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-xl bg-slate-50/60 border border-dashed border-slate-200">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">No comments yet</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Add a note, technical finding, or question to communicate regarding this ticket.
            </p>
          </div>
        ) : (
          comments.map((comment) => {
            const roleMeta = getRolePresentation(comment.user?.role);
            const RoleIcon = roleMeta.icon;

            return (
              <div
                key={comment._id}
                className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:bg-slate-100/70 hover:border-slate-300 space-y-2.5 transition-colors duration-150"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0 ${roleMeta.avatarBg}`}
                    >
                      {comment.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-900">
                          {comment.user?.name || 'User'}
                        </span>
                        <Badge
                          variant={roleMeta.badgeVariant}
                          className="text-[10px] px-1.5 py-0"
                        >
                          <span className="flex items-center gap-0.5">
                            <RoleIcon className="w-2.5 h-2.5" />
                            {roleMeta.label}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    {formatRelativeTime(comment.createdAt)}
                  </span>
                </div>

                <div className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed pl-0 sm:pl-9 break-words">
                  {comment.message}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="pt-2">
        <div className="space-y-3">
          <label
            htmlFor="commentMessage"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
          >
            Add a reply or technical note
          </label>
          <textarea
            id="commentMessage"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message, update, or clarification here..."
            className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 placeholder:text-slate-400 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-150"
          />
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-400">
              Press Post Comment to save
            </span>
            <Button
              type="submit"
              loading={submitting}
              icon={Send}
              size="sm"
            >
              Post Comment
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;
