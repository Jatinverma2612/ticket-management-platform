import React from 'react';
import { formatRelativeTime } from '../../utils/helpers';
import {
  History,
  CheckCircle2,
  UserCheck,
  Tag,
  AlertTriangle,
  MessageSquare,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';

const ActivityTimeline = ({ activities = [] }) => {
  const getActivityMeta = (action) => {
    switch (action) {
      case 'Ticket created':
        return {
          icon: PlusCircle,
          color: 'text-brand-600 bg-brand-50 border-brand-200',
        };
      case 'Ticket assigned':
        return {
          icon: UserCheck,
          color: 'text-blue-600 bg-blue-50 border-blue-200',
        };
      case 'Status changed':
        return {
          icon: Tag,
          color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
        };
      case 'Priority changed':
        return {
          icon: AlertTriangle,
          color: 'text-amber-600 bg-amber-50 border-amber-200',
        };
      case 'Ticket resolved':
        return {
          icon: CheckCircle2,
          color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
        };
      case 'Comment added':
        return {
          icon: MessageSquare,
          color: 'text-slate-600 bg-slate-100 border-slate-200',
        };
      default:
        return {
          icon: History,
          color: 'text-slate-500 bg-slate-100 border-slate-200',
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors duration-150 p-5 sm:p-6 space-y-5">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5">
        <History className="w-4 h-4 text-slate-500" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
          Activity History ({activities.length})
        </h3>
      </div>

      {activities.length === 0 ? (
        <p className="text-xs text-slate-400 italic text-center py-4">
          No activity recorded for this ticket yet.
        </p>
      ) : (
        <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {activities.map((act) => {
            const meta = getActivityMeta(act.action);
            const Icon = meta.icon;

            return (
              <div key={act._id || act.createdAt} className="relative flex items-start gap-3">
                <div
                  className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border flex items-center justify-center ${meta.color}`}
                >
                  <Icon className="w-3 h-3" />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">
                      {act.user?.name || 'System / User'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {formatRelativeTime(act.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-600">
                    {act.action}
                  </p>

                  {(act.oldValue !== null || act.newValue !== null) && (
                    <div className="inline-flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-200/70 mt-1 break-words">
                      {act.oldValue && (
                        <>
                          <span className="line-through text-slate-400 break-words">
                            {String(act.oldValue)}
                          </span>
                          <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                        </>
                      )}
                      <span className="font-semibold text-slate-800 break-words">
                        {String(act.newValue)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;
