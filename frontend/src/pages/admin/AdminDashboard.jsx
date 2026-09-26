import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { getErrorMessage } from '../../utils/helpers';
import TicketTable from '../../components/tickets/TicketTable';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import {
  Ticket,
  AlertCircle,
  Clock,
  CheckCircle2,
  Lock,
  Wrench,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ticketsRes, engineersRes] = await Promise.all([
        ticketService.getTickets(),
        ticketService.getEngineers(),
      ]);

      setTickets(ticketsRes.data || []);
      setEngineers(engineersRes.data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const counts = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status === 'Open').length,
      assigned: tickets.filter((t) => t.status === 'Assigned').length,
      inProgress: tickets.filter((t) => t.status === 'In Progress').length,
      resolved: tickets.filter((t) => t.status === 'Resolved').length,
      closed: tickets.filter((t) => t.status === 'Closed').length,
    };
  }, [tickets]);

  // Real chart data for Status Distribution
  const statusChartData = useMemo(() => {
    return [
      { name: 'Open', count: counts.open, fill: '#f59e0b' },
      { name: 'Assigned', count: counts.assigned, fill: '#3b82f6' },
      { name: 'In Progress', count: counts.inProgress, fill: '#6366f1' },
      { name: 'Resolved', count: counts.resolved, fill: '#10b981' },
      { name: 'Closed', count: counts.closed, fill: '#94a3b8' },
    ];
  }, [counts]);

  // Real chart data for Priority Distribution
  const priorityChartData = useMemo(() => {
    return [
      {
        name: 'High',
        count: tickets.filter((t) => t.priority === 'High').length,
        fill: '#ef4444',
      },
      {
        name: 'Medium',
        count: tickets.filter((t) => t.priority === 'Medium').length,
        fill: '#3b82f6',
      },
      {
        name: 'Low',
        count: tickets.filter((t) => t.priority === 'Low').length,
        fill: '#94a3b8',
      },
    ];
  }, [tickets]);

  if (loading) {
    return <Loader text="Loading administration operations..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  const pendingAssignment = tickets.filter((t) => t.status === 'Open');
  const recentTickets = tickets.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 block mb-1">
            System Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Administrator Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time platform ticket distribution, engineer workloads, and lifecycle dispatch.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/admin/engineers">
            <button className="px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl shadow-xs hover:shadow-sm transition-all duration-150 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20">
              <Wrench className="w-4 h-4 text-slate-500" />
              Engineers Directory ({engineers.length})
            </button>
          </Link>
          <Link to="/admin/tickets">
            <button className="px-3.5 py-2 text-xs sm:text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
              <Ticket className="w-4 h-4" />
              All Tickets ({tickets.length})
            </button>
          </Link>
        </div>
      </div>

      {/* 6 Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-150">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Total Tickets
          </span>
          <div className="text-2xl font-bold text-slate-900">{counts.total}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-150">
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider block mb-1">
            Open
          </span>
          <div className="text-2xl font-bold text-amber-600">{counts.open}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-150">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block mb-1">
            Assigned
          </span>
          <div className="text-2xl font-bold text-blue-600">{counts.assigned}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-150">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block mb-1">
            In Progress
          </span>
          <div className="text-2xl font-bold text-indigo-600">{counts.inProgress}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-150">
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider block mb-1">
            Resolved
          </span>
          <div className="text-2xl font-bold text-emerald-600">{counts.resolved}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-150">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Closed
          </span>
          <div className="text-2xl font-bold text-slate-700">{counts.closed}</div>
        </div>
      </div>

      {/* Attention Required Banner: Open Tickets Needing Assignment */}
      {pendingAssignment.length > 0 && (
        <div className="bg-amber-50/70 rounded-2xl border border-amber-200/90 p-5 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>{pendingAssignment.length} Ticket(s) Awaiting Technical Assignment</span>
            </div>
            <Link
              to="/admin/tickets?status=Open"
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 transition-colors self-start sm:self-auto"
            >
              <span>Review Open Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed max-w-3xl">
            Tickets in Open status must be assigned to an active engineer by an administrator so investigation can commence.
          </p>
        </div>
      )}

      {/* Visual Analytics Grid (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 min-w-0">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-600" />
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Status Lifecycle Breakdown
              </h2>
            </div>
            <span className="text-xs text-slate-400">Real-time counts</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value) => [`${value} tickets`, 'Count']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Breakdown Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 min-w-0">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Priority Tier Distribution
              </h2>
            </div>
            <span className="text-xs text-slate-400">By urgency</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value) => [`${value} tickets`, 'Priority Count']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {priorityChartData.map((entry, index) => (
                    <Cell key={`cell-priority-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Global Tickets Section */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Platform Tickets</h2>
          <Link
            to="/admin/tickets"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-800 transition-colors"
          >
            <span>View all ({tickets.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentTickets.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-xs text-sm text-slate-500">
            No tickets exist on the platform yet.
          </div>
        ) : (
          <TicketTable
            tickets={recentTickets}
            basePath="/admin/tickets"
            showCreator={true}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
