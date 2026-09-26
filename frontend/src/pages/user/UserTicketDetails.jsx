import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { formatDate, getErrorMessage } from '../../utils/helpers';
import StatusBadge from '../../components/tickets/StatusBadge';
import CommentSection from '../../components/tickets/CommentSection';
import ActivityTimeline from '../../components/tickets/ActivityTimeline';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import { PRIORITY_CONFIG } from '../../utils/constants';
import { ArrowLeft, User, Calendar, Tag, AlertCircle, Clock } from 'lucide-react';

const UserTicketDetails = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [activities, setActivities] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTicketDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ticketRes, commentsRes] = await Promise.all([
        ticketService.getTicketById(id),
        ticketService.getComments(id),
      ]);

      const ticketData = ticketRes.data?.ticket || ticketRes.data;
      const activityData = ticketRes.data?.activities || [];

      setTicket(ticketData);
      setActivities(activityData);
      setComments(commentsRes.data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTicketDetails();
  }, [fetchTicketDetails]);

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [...prev, newComment]);
    ticketService.getActivities(id).then((res) => {
      if (res.data) setActivities(res.data);
    });
  };

  if (loading) {
    return <Loader text="Loading ticket details..." />;
  }

  if (error || !ticket) {
    return <ErrorState message={error || 'Ticket not found'} onRetry={fetchTicketDetails} />;
  }

  const priorityConfig = PRIORITY_CONFIG[ticket.priority] || {
    badge: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/user/tickets"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 hover:border-slate-300 transition-all duration-150 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
            title="Back to my tickets"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-400">
                #{ticket._id.substring(ticket._id.length - 8).toUpperCase()}
              </span>
              <StatusBadge status={ticket.status} />
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityConfig.badge}`}>
                {ticket.priority} Priority
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 break-words">
              {ticket.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column (Description & Support Comments) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors duration-150 p-6 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Issue Description
            </h2>
            <div className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed break-words">
              {ticket.description}
            </div>
          </div>

          {/* Comments Feed */}
          <CommentSection
            ticketId={ticket._id}
            comments={comments}
            onCommentAdded={handleCommentAdded}
          />
        </div>

        {/* Sidebar (Metadata & Activity Timeline) */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors duration-150 p-5 space-y-4 text-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2.5">
              Ticket Metadata
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Category
                </span>
                <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  {ticket.category}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> Priority
                </span>
                <span className={`px-2 py-0.5 rounded-full font-semibold ${priorityConfig.badge}`}>
                  {ticket.priority}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Assigned Engineer
                </span>
                <span className="font-semibold text-slate-800">
                  {ticket.assignedTo ? ticket.assignedTo.name : 'Awaiting assignment'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Submitted
                </span>
                <span className="text-slate-600 font-medium">
                  {formatDate(ticket.createdAt)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Last Updated
                </span>
                <span className="text-slate-600 font-medium">
                  {formatDate(ticket.updatedAt || ticket.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <ActivityTimeline activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default UserTicketDetails;
