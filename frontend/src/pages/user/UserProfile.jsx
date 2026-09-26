import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/helpers';
import Badge from '../../components/common/Badge';
import { User, Mail, Shield, Calendar, CheckCircle2 } from 'lucide-react';

const UserProfile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          User Profile
        </h1>
        <p className="text-sm text-slate-500">
          Your account details and active permissions.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors duration-150 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-2xl shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
            <p className="text-sm text-slate-500 break-words">{user?.email}</p>
            <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <Badge variant="primary" className="capitalize">
                Role: {user?.role}
              </Badge>
              <Badge variant="success">
                Active Account
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/60 hover:border-slate-200 transition-colors duration-150">
            <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Full Name
            </span>
            <span className="font-semibold text-slate-800">{user?.name}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/60 hover:border-slate-200 transition-colors duration-150">
            <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Registered Email
            </span>
            <span className="font-semibold text-slate-800">{user?.email}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/60 hover:border-slate-200 transition-colors duration-150">
            <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Authorization Scope
            </span>
            <span className="font-semibold text-slate-800 capitalize">
              Standard User ({user?.role})
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/60 hover:border-slate-200 transition-colors duration-150">
            <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Member Since
            </span>
            <span className="font-semibold text-slate-800">
              {formatDate(user?.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
