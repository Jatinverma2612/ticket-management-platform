import React, { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ticketService } from '../../services/ticketService';
import { getUnviewedCommentsCount } from '../../utils/helpers';
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Users,
  Wrench,
  User,
  LogOut,
  X,
  Shield,
  MessageSquare,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [incomingCommentsCount, setIncomingCommentsCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    let isMounted = true;

    const isCommentsPage =
      location.pathname === '/admin/comments' ||
      location.pathname === '/engineer/comments';

    // If currently viewing Comments inbox, clear badge immediately
    if (isCommentsPage) {
      setIncomingCommentsCount(0);
    }

    const fetchIncomingCommentsCount = async () => {
      if (user?.role === 'admin' || user?.role === 'engineer') {
        if (isCommentsPage) {
          if (isMounted) setIncomingCommentsCount(0);
          return;
        }

        try {
          const res = await ticketService.getCommentsInbox();
          if (isMounted) {
            const comments = res.data || [];
            const unviewed = getUnviewedCommentsCount(comments, user?._id || user?.role);
            setIncomingCommentsCount(unviewed);
          }
        } catch (error) {
          // Non-blocking background fetch
        }
      }
    };

    fetchIncomingCommentsCount();

    const handleCommentsViewed = () => {
      if (isMounted) {
        setIncomingCommentsCount(0);
      }
    };

    window.addEventListener('ticketflow_comments_viewed', handleCommentsViewed);

    return () => {
      isMounted = false;
      window.removeEventListener('ticketflow_comments_viewed', handleCommentsViewed);
    };
  }, [user, location.pathname]);

  const getPortalInfo = () => {
    switch (user?.role) {
      case 'admin':
        return {
          title: 'ADMIN PORTAL',
          badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
          icon: Shield,
        };
      case 'engineer':
        return {
          title: 'ENGINEER PORTAL',
          badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/80',
          icon: Wrench,
        };
      case 'user':
      default:
        return {
          title: 'USER PORTAL',
          badgeClass: 'bg-brand-50 text-brand-700 border-brand-200/80',
          icon: User,
        };
    }
  };

  const portalInfo = getPortalInfo();

  const getNavLinks = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Operations Overview', icon: LayoutDashboard },
          { to: '/admin/tickets', label: 'All Tickets Queue', icon: Ticket },
          { to: '/admin/comments', label: 'Comments', icon: MessageSquare, badge: incomingCommentsCount },
          { to: '/admin/engineers', label: 'Engineer Directory', icon: Wrench },
          { to: '/admin/users', label: 'System Users', icon: Users },
        ];
      case 'engineer':
        return [
          { to: '/engineer/dashboard', label: 'My Workbench', icon: LayoutDashboard },
          { to: '/engineer/comments', label: 'Comments', icon: MessageSquare, badge: incomingCommentsCount },
          { to: '/engineer/profile', label: 'Engineer Profile', icon: User },
        ];
      case 'user':
      default:
        return [
          { to: '/user/dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
          { to: '/user/tickets', label: 'My Tickets', icon: Ticket },
          { to: '/user/tickets/new', label: 'Submit New Ticket', icon: PlusCircle },
          { to: '/user/profile', label: 'User Profile', icon: User },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 border-r border-slate-200 bg-white flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex h-16 items-center justify-between px-5 border-b border-slate-200">
            <Link to="/" className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-brand-500/20 rounded-lg">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-xs group-hover:bg-brand-700 transition-colors duration-150">
                <Ticket className="w-4 h-4" />
              </div>
              <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors duration-150">
                TicketFlow
              </span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-slate-300 lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Portal Identity Badge */}
          <div className="px-5 pt-4 pb-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${portalInfo.badgeClass}`}
            >
              <portalInfo.icon className="w-3 h-3" />
              {portalInfo.title}
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 overflow-y-auto">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 font-semibold border-l-[3px] border-brand-600 rounded-l-none pl-2.5 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 hover:translate-x-0.5'
                    }`
                  }
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {Boolean(item.badge && item.badge > 0) && (
                    <span className="ml-2 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white min-w-[18px] text-center leading-none">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout Section */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs mb-2 hover:border-slate-300 transition-colors duration-150">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {user?.name || 'Account'}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-150 border border-transparent hover:border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 active:bg-rose-100"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
