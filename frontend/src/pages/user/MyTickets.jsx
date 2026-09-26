import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { getErrorMessage } from '../../utils/helpers';
import TicketTable from '../../components/tickets/TicketTable';
import TicketFilters from '../../components/tickets/TicketFilters';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { PlusCircle, Ticket as TicketIcon } from 'lucide-react';

const MyTickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [category, setCategory] = useState('');

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

  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
    setPriority('');
    setCategory('');
  };

  // Filter tickets on client
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
    return <Loader text="Loading your tickets..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchTickets} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Support Tickets
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track, filter, and review all requests you have submitted ({tickets.length} total).
          </p>
        </div>
        <Link to="/user/tickets/new">
          <Button icon={PlusCircle}>Submit New Ticket</Button>
        </Link>
      </div>

      {/* Filters */}
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

      {/* Ticket List / Table */}
      {filteredTickets.length === 0 ? (
        <EmptyState
          icon={TicketIcon}
          title={tickets.length === 0 ? 'No tickets submitted yet' : 'No matching tickets found'}
          description={
            tickets.length === 0
              ? 'Have an issue or technical question? Open a ticket and our technical team will assist you.'
              : 'Try clearing your search filters or adjusting the status/priority selection.'
          }
          actionLabel={tickets.length === 0 ? 'Create Support Ticket' : 'Reset All Filters'}
          onAction={tickets.length === 0 ? () => navigate('/user/tickets/new') : handleClearFilters}
        />
      ) : (
        <TicketTable tickets={filteredTickets} basePath="/user/tickets" />
      )}
    </div>
  );
};

export default MyTickets;
