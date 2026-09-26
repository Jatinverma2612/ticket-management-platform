import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { PRIORITY_CONFIG } from '../../utils/constants';
import { formatDate, formatRelativeTime } from '../../utils/helpers';
import { ChevronRight, User, Clock, ArrowUpRight } from 'lucide-react';

const TicketTable = ({ tickets = [], basePath = '/user/tickets', showCreator = false }) => {
  const navigate = useNavigate();

  if (!tickets.length) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Desktop Table View (>= md screens) */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-5 py-3.5">Ticket</th>
                <th scope="col" className="px-4 py-3.5">Category</th>
                <th scope="col" className="px-4 py-3.5">Priority</th>
                <th scope="col" className="px-4 py-3.5">Status</th>
                {showCreator && <th scope="col" className="px-4 py-3.5">Reporter</th>}
                <th scope="col" className="px-4 py-3.5">Assignee</th>
                <th scope="col" className="px-4 py-3.5">Date</th>
                <th scope="col" className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map((ticket) => {
                const priorityConfig = PRIORITY_CONFIG[ticket.priority] || {
                  label: ticket.priority,
                  badge: 'bg-slate-100 text-slate-700',
                };

                return (
                  <tr
                    key={ticket._id}
                    onClick={() => navigate(`${basePath}/${ticket._id}`)}
                    className="hover:bg-slate-50/90 transition-colors duration-150 cursor-pointer group focus-within:bg-slate-50"
                  >
                    <td className="px-5 py-3.5 max-w-xs sm:max-w-sm">
                      <div className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors duration-150 truncate">
                        {ticket.title}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        #{ticket._id.substring(ticket._id.length - 8).toUpperCase()}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {ticket.category}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${priorityConfig.badge}`}
                      >
                        {ticket.priority}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <StatusBadge status={ticket.status} />
                    </td>

                    {showCreator && (
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-700 font-medium">
                        {ticket.createdBy?.name || 'User'}
                      </td>
                    )}

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {ticket.assignedTo ? (
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{ticket.assignedTo.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs italic text-slate-400">Unassigned</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-500">
                      {formatDate(ticket.createdAt)}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-right">
                      <Link
                        to={`${basePath}/${ticket._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors duration-150"
                      >
                        <span>View</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List View (< md screens) */}
      <div className="md:hidden space-y-3">
        {tickets.map((ticket) => {
          const priorityConfig = PRIORITY_CONFIG[ticket.priority] || {
            label: ticket.priority,
            badge: 'bg-slate-100 text-slate-700',
          };

          return (
            <div
              key={ticket._id}
              onClick={() => navigate(`${basePath}/${ticket._id}`)}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-150 cursor-pointer active:bg-slate-50"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-mono text-slate-400">
                  #{ticket._id.substring(ticket._id.length - 8).toUpperCase()}
                </span>
                <StatusBadge status={ticket.status} />
              </div>

              <h3 className="font-semibold text-slate-900 text-sm mb-2 line-clamp-2">
                {ticket.title}
              </h3>

              <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                  {ticket.category}
                </span>
                <span className={`px-2 py-0.5 rounded-full font-semibold ${priorityConfig.badge}`}>
                  {ticket.priority}
                </span>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate max-w-[140px]">
                    {ticket.assignedTo ? ticket.assignedTo.name : 'Unassigned'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>{formatRelativeTime(ticket.createdAt)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TicketTable;
