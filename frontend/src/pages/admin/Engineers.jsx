import React, { useEffect, useState } from 'react';
import { ticketService } from '../../services/ticketService';
import { getErrorMessage } from '../../utils/helpers';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import { Wrench, Mail, CheckCircle2, Ticket, Search, UserCheck } from 'lucide-react';

const Engineers = () => {
  const [engineers, setEngineers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchEngineersData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [engRes, ticketRes] = await Promise.all([
        ticketService.getEngineers(),
        ticketService.getTickets(),
      ]);

      setEngineers(engRes.data || []);
      setTickets(ticketRes.data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEngineersData();
  }, []);

  if (loading) {
    return <Loader text="Loading technical staff directory..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchEngineersData} />;
  }

  const filtered = engineers.filter(
    (e) =>
      e.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Technical Staff Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Engineers available for support dispatch, active queue workloads, and resolution metrics.
          </p>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search engineers by name or email..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white shadow-xs transition-all duration-150"
          />
        </div>
      </div>

      {/* Engineers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((eng) => {
          const assignedTickets = tickets.filter(
            (t) => t.assignedTo && (t.assignedTo._id === eng._id || t.assignedTo === eng._id)
          );
          const activeTickets = assignedTickets.filter(
            (t) => t.status === 'Assigned' || t.status === 'In Progress'
          );
          const resolvedTickets = assignedTickets.filter(
            (t) => t.status === 'Resolved' || t.status === 'Closed'
          );

          return (
            <div
              key={eng._id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 hover:shadow-sm transition-all duration-150"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center font-bold text-base shrink-0">
                    {eng.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-slate-900 truncate">
                      {eng.name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                      <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{eng.email}</span>
                    </p>
                  </div>
                </div>

                <Badge
                  variant={eng.isAvailable !== false ? 'success' : 'default'}
                  dot
                  className="shrink-0"
                >
                  {eng.isAvailable !== false ? 'Available' : 'Busy'}
                </Badge>
              </div>

              {/* Workload Stats */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/60 hover:border-slate-200 transition-colors duration-150">
                  <span className="text-slate-400 block mb-0.5 text-[11px] font-semibold uppercase tracking-wider">
                    Active Queue
                  </span>
                  <span className="text-base font-bold text-blue-600">
                    {activeTickets.length} ticket{activeTickets.length === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/60 hover:border-slate-200 transition-colors duration-150">
                  <span className="text-slate-400 block mb-0.5 text-[11px] font-semibold uppercase tracking-wider">
                    Resolved Total
                  </span>
                  <span className="text-base font-bold text-emerald-600">
                    {resolvedTickets.length} ticket{resolvedTickets.length === 1 ? '' : 's'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Engineers;
