export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  ENGINEER: 'engineer',
};

export const TICKET_STATUSES = {
  OPEN: 'Open',
  ASSIGNED: 'Assigned',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
};

export const TICKET_PRIORITIES = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

export const TICKET_CATEGORIES = [
  'Technical Support',
  'Bug / System Glitch',
  'Feature Request',
  'Account & Access',
  'Billing / Payments',
  'Infrastructure',
  'Other',
];

export const STATUS_CONFIG = {
  'Open': {
    label: 'Open',
    color: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
    dot: 'bg-amber-500',
  },
  'Assigned': {
    label: 'Assigned',
    color: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20',
    dot: 'bg-blue-500',
  },
  'In Progress': {
    label: 'In Progress',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20',
    dot: 'bg-indigo-500 animate-pulse',
  },
  'Resolved': {
    label: 'Resolved',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
    dot: 'bg-emerald-500',
  },
  'Closed': {
    label: 'Closed',
    color: 'bg-slate-100 text-slate-600 border-slate-200 ring-slate-400/20',
    dot: 'bg-slate-400',
  },
};

export const PRIORITY_CONFIG = {
  'Low': {
    label: 'Low',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    badge: 'text-slate-600 bg-slate-100',
  },
  'Medium': {
    label: 'Medium',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    badge: 'text-blue-700 bg-blue-50',
  },
  'High': {
    label: 'High',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    badge: 'text-rose-700 bg-rose-50',
  },
};

export const ROLE_DEFAULT_ROUTES = {
  user: '/user/dashboard',
  admin: '/admin/dashboard',
  engineer: '/engineer/dashboard',
};
