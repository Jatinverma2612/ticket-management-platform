import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Menu, User, Shield, Wrench, Ticket as TicketIcon } from 'lucide-react';
import Badge from '../common/Badge';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-3 h-3" />;
      case 'engineer':
        return <Wrench className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'engineer':
        return 'info';
      default:
        return 'primary';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 lg:px-8 backdrop-blur transition-all">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-slate-300 lg:hidden"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="font-semibold text-slate-800 capitalize">
            {user?.role} Workspace
          </span>
          <span className="text-slate-300 hidden sm:inline">&bull;</span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Active Session
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-800 leading-tight">
                {user.name}
              </span>
              <span className="text-xs text-slate-400">{user.email}</span>
            </div>

            <Badge
              variant={getRoleBadgeVariant(user.role)}
              className="capitalize hidden sm:inline-flex"
            >
              <span className="flex items-center gap-1">
                {getRoleIcon(user.role)}
                {user.role}
              </span>
            </Badge>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 hover:shadow-xs active:bg-rose-100 rounded-lg transition-all duration-150 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              title="Sign out of platform"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
