import React from 'react';
import { Search, X } from 'lucide-react';
import { TICKET_STATUSES, TICKET_PRIORITIES, TICKET_CATEGORIES } from '../../utils/constants';

const TicketFilters = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  category,
  onCategoryChange,
  onClear,
}) => {
  const hasActiveFilters = Boolean(search || status || priority || category);

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors duration-150 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-150"
          />
        </div>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white transition-all duration-150"
        >
          <option value="">All Statuses</option>
          {Object.values(TICKET_STATUSES).map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white transition-all duration-150"
        >
          <option value="">All Priorities</option>
          {Object.values(TICKET_PRIORITIES).map((pr) => (
            <option key={pr} value={pr}>
              {pr}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white transition-all duration-150"
        >
          <option value="">All Categories</option>
          {TICKET_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-slate-300 rounded p-1"
          >
            <X className="w-3.5 h-3.5" />
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default TicketFilters;
