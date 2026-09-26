import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ticketService } from '../../services/ticketService';
import {
  formatRelativeTime,
  getErrorMessage,
  getViewedCommentIds,
  markCommentsAsViewed,
} from '../../utils/helpers';
import StatusBadge from '../../components/tickets/StatusBadge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { MessageSquare, Clock, ArrowRight, User, Sparkles } from 'lucide-react';

const EngineerComments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newCommentIds, setNewCommentIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ticketService.getCommentsInbox();
      const fetched = response.data || [];
      setComments(fetched);

      // Keep "New" badge only for comments that have not yet been viewed in the current session
      const previouslyViewed = getViewedCommentIds(user?._id || user?.role);
      const unviewedIds = fetched
        .filter((c) => !previouslyViewed.includes(c._id))
        .map((c) => c._id);
      setNewCommentIds(new Set(unviewedIds));

      // Opening the Comments inbox marks those currently displayed incoming comments as viewed for current session
      markCommentsAsViewed(
        user?._id || user?.role,
        fetched.map((c) => c._id)
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [user]);

  if (loading) {
    return <Loader text="Loading incoming user comments..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchComments} />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          <MessageSquare className="w-3.5 h-3.5" />
          Incoming User Activity
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Comments / Responses
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Recent comments submitted by users on tickets assigned to you ({comments.length} total).
        </p>
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No recent comments"
          description="You're all caught up. Any new comments submitted by users on your assigned tickets will appear here."
        />
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => {
            const ticket = comment.ticket || {};
            const isNew = newCommentIds.has(comment._id);

            return (
              <div
                key={comment._id}
                onClick={() => navigate(`/engineer/tickets/${ticket._id}`)}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-150 cursor-pointer group focus-within:ring-2 focus-within:ring-brand-500/20"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                      {comment.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">
                          {comment.user?.name || 'User'}
                        </span>
                        {isNew && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <Sparkles className="w-2.5 h-2.5" />
                            New
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">
                        {comment.user?.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 self-start sm:self-auto">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatRelativeTime(comment.createdAt)}</span>
                  </div>
                </div>

                {/* Ticket Title Reference */}
                <div className="mb-2.5 flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-mono text-slate-400">
                    #{ticket._id?.substring(ticket._id.length - 8).toUpperCase()}
                  </span>
                  <span className="font-semibold text-slate-800 group-hover:text-brand-600 transition-colors duration-150 break-words">
                    {ticket.title}
                  </span>
                  {ticket.status && <StatusBadge status={ticket.status} />}
                </div>

                {/* Comment Preview */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/60 hover:border-slate-200 transition-colors duration-150 text-sm text-slate-700 leading-relaxed italic break-words">
                  "{comment.message}"
                </div>

                <div className="mt-3 flex items-center justify-end text-xs font-semibold text-brand-600 group-hover:text-brand-800 transition-colors duration-150">
                  <span>Open ticket & reply</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform duration-150" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EngineerComments;
