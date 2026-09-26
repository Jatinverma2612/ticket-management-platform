import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { getErrorMessage } from '../../utils/helpers';
import TicketTable from '../../components/tickets/TicketTable';
import TicketFilters from '../../components/tickets/TicketFilters';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { Ticket as TicketIcon, UserCheck } from 'lucide-react';

const AllTickets = () => {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || '';

  const [tickets, setTickets] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(initialStatus);
  const [priority, setPriority] = useState('');
  const [category, setCategory] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  const fetchData = async () => {
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
    fetchData();
  }, []);

  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
    setPriority('');
    setCategory('');
    setAssigneeId('');
  };

  // Client-side filtering
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        (t.createdBy?.name && t.createdBy.name.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = !status || t.status === status;
      const matchesPriority = !priority || t.priority === priority;
      const matchesCategory = !category || t.category === category;
      const matchesAssignee =
        !assigneeId || (t.assignedTo && t.assignedTo._id === assigneeId);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesCategory &&
        matchesAssignee
      );
    });
  }, [tickets, search, status, priority, category, assigneeId]);

  if (loading) {
    return <Loader text="Loading global tickets queue..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Global Tickets Queue
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete cross-organizational ticket management ({tickets.length} total, {filteredTickets.length} matching).
        </p>
      </div>

      {/* Filters Stack */}
      <div className="space-y-3">
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

        {/* Additional Engineer filter for Administrator */}
        <div className="flex flex-wrap items-center gap-2.5 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors duration-150 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-slate-500">
            <UserCheck className="w-3.5 h-3.5 text-brand-600" />
            <span>Filter by Assignee:</span>
          </div>
          <select
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            className="rounded-lg border border-slate-300 hover:border-slate-400 px-3 py-1.5 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-150"
          >
            <option value="">All Technical Assignees</option>
            {engineers.map((eng) => (
              <option key={eng._id} value={eng._id}>
                {eng.name} ({eng.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table / List */}
      {filteredTickets.length === 0 ? (
        <EmptyState
          icon={TicketIcon}
          title="No tickets match criteria"
          description="Try broadening your search term or resetting the status, priority, and assignee filters."
          actionLabel="Reset All Filters"
          onAction={handleClearFilters}
        />
      ) : (
        <TicketTable
          tickets={filteredTickets}
          basePath="/admin/tickets"
          showCreator={true}
        />
      )}
    </div>
  );
};

export default AllTickets;
