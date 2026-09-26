import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { PRIORITY_CONFIG } from '../../utils/constants';
import { formatRelativeTime } from '../../utils/helpers';
import { User, Clock, ChevronRight } from 'lucide-react';

const TicketCard = ({ ticket, basePath = '/user/tickets' }) => {
  const priorityConfig = PRIORITY_CONFIG[ticket.priority] || {
    badge: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-150 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <span className="text-xs font-mono text-slate-400">
            #{ticket._id.substring(ticket._id.length - 6).toUpperCase()}
          </span>
          <StatusBadge status={ticket.status} />
        </div>

        <Link
          to={`${basePath}/${ticket._id}`}
          className="font-semibold text-slate-900 hover:text-brand-600 transition-colors duration-150 line-clamp-2 mb-2 focus:outline-none focus:ring-1 focus:ring-brand-500 rounded"
        >
          {ticket.title}
        </Link>

        <p className="text-xs text-slate-500 line-clamp-2 mb-4">
          {ticket.description}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full font-medium ${priorityConfig.badge}`}>
            {ticket.priority}
          </span>
          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
            {ticket.category}
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatRelativeTime(ticket.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
