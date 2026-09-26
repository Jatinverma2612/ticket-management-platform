import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ticketService } from '../../services/ticketService';
import { getErrorMessage } from '../../utils/helpers';
import TicketTable from '../../components/tickets/TicketTable';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import {
  PlusCircle,
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Inbox,
} from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ticketService.getTickets();
      setTickets(response.data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'Open').length,
    inProgress: tickets.filter((t) => t.status === 'In Progress' || t.status === 'Assigned').length,
    resolved: tickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length,
  };

  if (loading) {
    return <Loader text="Loading your dashboard overview..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchTickets} />;
  }

  const recentTickets = tickets.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-slate-300 transition-colors duration-150 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 block mb-1">
            Personal Support Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {user?.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500 max-w-xl">
            Track your open support requests, review engineer updates, or submit a new inquiry.
          </p>
        </div>
        <Link to="/user/tickets/new" className="shrink-0 w-full sm:w-auto">
          <Button icon={PlusCircle} className="w-full sm:w-auto">
            Create Ticket
          </Button>
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-150">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Tickets</span>
            <Ticket className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">{stats.total}</div>
          <p className="text-[11px] text-slate-400 mt-1">All submitted requests</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-150">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Open</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-600">{stats.open}</div>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting engineer assignment</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-150">
          <div className="flex items-center justify-between text-blue-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">In Progress</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.inProgress}</div>
          <p className="text-[11px] text-slate-400 mt-1">Assigned & actively investigated</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-150">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-600">{stats.resolved}</div>
          <p className="text-[11px] text-slate-400 mt-1">Fixed or closed issues</p>
        </div>
      </div>

      {/* Recent Tickets Section */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Support Requests</h2>
          {tickets.length > 0 && (
            <Link
              to="/user/tickets"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-800 transition-colors duration-150"
            >
              <span>View all ({tickets.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {recentTickets.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No tickets submitted yet"
            description="You haven't submitted any support requests. If you are experiencing technical difficulties, open your first ticket."
            actionLabel="Create Your First Ticket"
            onAction={() => window.location.assign('/user/tickets/new')}
          />
        ) : (
          <TicketTable tickets={recentTickets} basePath="/user/tickets" />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
