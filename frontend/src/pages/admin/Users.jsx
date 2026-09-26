import React, { useEffect, useState } from 'react';
import { ticketService } from '../../services/ticketService';
import { getErrorMessage, formatDate } from '../../utils/helpers';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import { Users as UsersIcon, User, Search, Ticket } from 'lucide-react';

const Users = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await ticketService.getTickets();
        setTickets(res.data || []);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <Loader text="Loading user accounts overview..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  // Derive submitter user list from tickets
  const userMap = new Map();
  tickets.forEach((t) => {
    if (t.createdBy && !userMap.has(t.createdBy._id)) {
      userMap.set(t.createdBy._id, {
        ...t.createdBy,
        submittedCount: 1,
        firstActive: t.createdAt,
      });
    } else if (t.createdBy) {
      const u = userMap.get(t.createdBy._id);
      u.submittedCount += 1;
    }
  });

  const userList = Array.from(userMap.values()).filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Registered Submitter Accounts
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Accounts actively creating support requests across the platform.
          </p>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white shadow-xs transition-all duration-150"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors duration-150 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Total Submitted</th>
                <th className="px-6 py-3.5">First Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic">
                    No active submitters found matching your search.
                  </td>
                </tr>
              ) : (
                userList.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {u.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate">{u.name}</div>
                          <div className="text-xs text-slate-400 truncate">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="primary" className="capitalize">
                        {u.role || 'user'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {u.submittedCount} ticket{u.submittedCount === 1 ? '' : 's'}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {formatDate(u.firstActive)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
