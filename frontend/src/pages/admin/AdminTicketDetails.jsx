import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { formatDate, getErrorMessage } from '../../utils/helpers';
import StatusBadge from '../../components/tickets/StatusBadge';
import CommentSection from '../../components/tickets/CommentSection';
import ActivityTimeline from '../../components/tickets/ActivityTimeline';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import { PRIORITY_CONFIG, TICKET_PRIORITIES } from '../../utils/constants';
import {
  ArrowLeft,
  User,
  Calendar,
  Tag,
  AlertCircle,
  Wrench,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  Shield,
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminTicketDetails = () => {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [activities, setActivities] = useState([]);
  const [comments, setComments] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Action modals/states
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedEngineerId, setSelectedEngineerId] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ticketRes, commentsRes, engineersRes] = await Promise.all([
        ticketService.getTicketById(id),
        ticketService.getComments(id),
        ticketService.getEngineers(),
      ]);

      const ticketData = ticketRes.data?.ticket || ticketRes.data;
      const activityData = ticketRes.data?.activities || [];

      setTicket(ticketData);
      setActivities(activityData);
      setComments(commentsRes.data || []);
      setEngineers(engineersRes.data || []);

      if (ticketData.assignedTo) {
        setSelectedEngineerId(ticketData.assignedTo._id);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  // Handle Engineer Assignment
  const handleAssign = async () => {
    if (!selectedEngineerId) {
      toast.error('Please choose an engineer to assign.');
      return;
    }

    setActionLoading(true);
    try {
      const res = await ticketService.assignTicket(id, selectedEngineerId);
      toast.success(res.message || 'Engineer assigned successfully');
      setTicket(res.data);
      setAssignModalOpen(false);

      // Refresh activities
      const actRes = await ticketService.getActivities(id);
      if (actRes.data) setActivities(actRes.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Priority Change
  const handlePriorityChange = async (newPriority) => {
    if (newPriority === ticket.priority) return;

    setActionLoading(true);
    try {
      const res = await ticketService.updatePriority(id, newPriority);
      toast.success(`Priority updated to ${newPriority}`);
      setTicket(res.data);

      const actRes = await ticketService.getActivities(id);
      if (actRes.data) setActivities(actRes.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Status Update
  const handleStatusChange = async (newStatus) => {
    setActionLoading(true);
    try {
      const res = await ticketService.updateStatus(id, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      setTicket(res.data);

      const actRes = await ticketService.getActivities(id);
      if (actRes.data) setActivities(actRes.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [...prev, newComment]);
    ticketService.getActivities(id).then((res) => {
      if (res.data) setActivities(res.data);
    });
  };

  if (loading) {
    return <Loader text="Loading ticket administration view..." />;
  }

  if (error || !ticket) {
    return <ErrorState message={error || 'Ticket not found'} onRetry={fetchDetails} />;
  }

  const priorityConfig = PRIORITY_CONFIG[ticket.priority] || {
    badge: 'bg-slate-100 text-slate-700',
  };

  // Allowed next steps per lifecycle
  const allowedNextTransitions = {
    Open: ['Assigned'],
    Assigned: ['In Progress'],
    'In Progress': ['Resolved'],
    Resolved: ['Closed'],
    Closed: [],
  };

  const nextAllowed = allowedNextTransitions[ticket.status] || [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/tickets"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 hover:border-slate-300 transition-all duration-150 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
            title="Back to all tickets"
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

        {/* Quick Lifecycle Action Buttons for Admin */}
        <div className="flex flex-wrap items-center gap-2">
          {ticket.status === 'Resolved' && (
            <Button
              variant="primary"
              size="sm"
              icon={Lock}
              loading={actionLoading}
              onClick={() => handleStatusChange('Closed')}
              className="bg-slate-800 hover:bg-slate-900"
            >
              Close Ticket
            </Button>
          )}

          {ticket.status === 'Open' && (
            <Button
              size="sm"
              icon={Wrench}
              onClick={() => setAssignModalOpen(true)}
            >
              Assign to Engineer
            </Button>
          )}

          {ticket.status !== 'Open' && (
            <Button
              variant="outline"
              size="sm"
              icon={Wrench}
              onClick={() => setAssignModalOpen(true)}
            >
              Reassign Engineer
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors duration-150 p-6 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Description & Summary
            </h2>
            <div className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed break-words">
              {ticket.description}
            </div>
          </div>

          {/* Comments Component */}
          <CommentSection
            ticketId={ticket._id}
            comments={comments}
            onCommentAdded={handleCommentAdded}
          />
        </div>

        {/* Sidebar Administrative Controls */}
        <div className="space-y-6">
          {/* Controls Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors duration-150 p-5 space-y-5 text-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Shield className="w-4 h-4 text-brand-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Administrative Controls
              </h3>
            </div>

            {/* Priority Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 block">
                Update Priority Tier
              </label>
              <select
                value={ticket.priority}
                disabled={actionLoading}
                onChange={(e) => handlePriorityChange(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 hover:border-slate-400 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-150"
              >
                {Object.values(TICKET_PRIORITIES).map((pr) => (
                  <option key={pr} value={pr}>
                    {pr} Priority
                  </option>
                ))}
              </select>
            </div>

            {/* Advance Status */}
            {nextAllowed.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="text-xs font-semibold text-slate-600 block">
                  Advance Lifecycle Step
                </label>
                <div className="flex flex-wrap gap-2">
                  {nextAllowed.map((nextSt) => (
                    <Button
                      key={nextSt}
                      size="sm"
                      variant="outline"
                      loading={actionLoading}
                      onClick={() => handleStatusChange(nextSt)}
                      className="text-xs w-full justify-between"
                    >
                      <span>Advance to {nextSt}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Ticket Metadata */}
            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
                <span className="text-slate-400 flex items-center gap-1.5 shrink-0">
                  <User className="w-3.5 h-3.5" /> Submitter
                </span>
                <span className="font-semibold text-slate-800 break-words sm:text-right">
                  {ticket.createdBy?.name || 'User'} ({ticket.createdBy?.email})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5" /> Assignee
                </span>
                <span className="font-semibold text-slate-800">
                  {ticket.assignedTo ? ticket.assignedTo.name : 'Unassigned'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Category
                </span>
                <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {ticket.category}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Created Date
                </span>
                <span className="text-slate-600 font-medium">{formatDate(ticket.createdAt)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Last Modified
                </span>
                <span className="text-slate-600 font-medium">{formatDate(ticket.updatedAt || ticket.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Activity Timeline Component */}
          <ActivityTimeline activities={activities} />
        </div>
      </div>

      {/* Assignment Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={ticket.assignedTo ? 'Reassign Support Ticket' : 'Assign Engineer to Ticket'}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Select an engineer from the active technical staff. Assigning a ticket automatically updates its status to <strong>Assigned</strong>.
          </p>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">
              Available Technical Staff
            </label>
            <select
              value={selectedEngineerId}
              onChange={(e) => setSelectedEngineerId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 hover:border-slate-400 p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-150"
            >
              <option value="" disabled>
                -- Choose an Engineer --
              </option>
              {engineers.map((eng) => (
                <option key={eng._id} value={eng._id}>
                  {eng.name} ({eng.email}) {eng.isAvailable ? '• Available' : '• Busy'}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              variant="ghost"
              onClick={() => setAssignModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              loading={actionLoading}
              icon={CheckCircle2}
            >
              Confirm Assignment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminTicketDetails;
