import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ticketService } from '../../services/ticketService';
import { getErrorMessage } from '../../utils/helpers';
import TicketTable from '../../components/tickets/TicketTable';
import TicketFilters from '../../components/tickets/TicketFilters';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { Wrench, Clock, CheckCircle2, AlertCircle, PlayCircle, Inbox } from 'lucide-react';

const EngineerDashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [category, setCategory] = useState('');

  const fetchAssignedTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ticketService.getTickets();
      // Backend automatically scopes GET /tickets to tickets assigned to this engineer
      setTickets(response.data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedTickets();
  }, []);

  const counts = useMemo(() => {
    return {
      total: tickets.length,
      assigned: tickets.filter((t) => t.status === 'Assigned').length,
      inProgress: tickets.filter((t) => t.status === 'In Progress').length,
      resolved: tickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length,
    };
  }, [tickets]);

  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
    setPriority('');
    setCategory('');
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !status || t.status === status;
      const matchesPriority = !priority || t.priority === priority;
      const matchesCategory = !category || t.category === category;

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [tickets, search, status, priority, category]);

  if (loading) {
    return <Loader text="Loading your engineering workbench..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchAssignedTickets} />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-slate-300 transition-colors duration-150">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          <Wrench className="w-3.5 h-3.5" />
          Technical Support Workbench
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Hello, {user?.name}
        </h1>
        <p className="mt-1 text-sm text-slate-500 max-w-2xl">
          Review your assigned tickets, start technical investigations, and mark issues as resolved with resolution commentary.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-150">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Total Assigned
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">{counts.total}</div>
          <p className="text-[11px] text-slate-400 mt-1">Assigned to your queue</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-150">
          <div className="flex items-center justify-between text-blue-600 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Ready to Start</span>
            <PlayCircle className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-blue-600">{counts.assigned}</div>
          <p className="text-[11px] text-slate-400 mt-1">Assigned status</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-150">
          <div className="flex items-center justify-between text-indigo-600 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">In Progress</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-indigo-600">{counts.inProgress}</div>
          <p className="text-[11px] text-slate-400 mt-1">Under active investigation</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-150">
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-600">{counts.resolved}</div>
          <p className="text-[11px] text-slate-400 mt-1">Completed / Closed</p>
        </div>
      </div>

      {/* Filters Stack */}
      <TicketFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        priority={priority}
        onPriorityChange={setPriority}
        category={category}
        onCategoryChange={setCategory}
        onClear={handleClearFilters}
      />

      {/* Tickets Table / List */}
      <div className="space-y-3.5">
        <h2 className="text-lg font-bold text-slate-900">
          Assigned Work Queue ({filteredTickets.length})
        </h2>
        {filteredTickets.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={tickets.length === 0 ? 'No assigned tickets' : 'No matching tickets'}
            description={
              tickets.length === 0
                ? 'You currently have no tickets assigned. As new issues are assigned by administrators, they will appear here.'
                : 'Try clearing your search query or resetting your active filters.'
            }
            actionLabel={tickets.length === 0 ? undefined : 'Reset Filters'}
            onAction={handleClearFilters}
          />
        ) : (
          <TicketTable
            tickets={filteredTickets}
            basePath="/engineer/tickets"
            showCreator={true}
          />
        )}
      </div>
    </div>
  );
};

export default EngineerDashboard;
