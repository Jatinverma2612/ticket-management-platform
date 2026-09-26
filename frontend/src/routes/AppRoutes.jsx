import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public pages
import Landing from '../pages/public/Landing';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';

// User pages
import UserDashboard from '../pages/user/UserDashboard';
import MyTickets from '../pages/user/MyTickets';
import CreateTicket from '../pages/user/CreateTicket';
import UserTicketDetails from '../pages/user/UserTicketDetails';
import UserProfile from '../pages/user/UserProfile';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AllTickets from '../pages/admin/AllTickets';
import AdminComments from '../pages/admin/AdminComments';
import AdminTicketDetails from '../pages/admin/AdminTicketDetails';
import Engineers from '../pages/admin/Engineers';
import Users from '../pages/admin/Users';

// Engineer pages
import EngineerDashboard from '../pages/engineer/EngineerDashboard';
import EngineerComments from '../pages/engineer/EngineerComments';
import EngineerTicketDetails from '../pages/engineer/EngineerTicketDetails';
import EngineerProfile from '../pages/engineer/EngineerProfile';

// Layout & Route Guards
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected User Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles="user" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/tickets" element={<MyTickets />} />
            <Route path="/user/tickets/new" element={<CreateTicket />} />
            <Route path="/user/tickets/:id" element={<UserTicketDetails />} />
            <Route path="/user/profile" element={<UserProfile />} />
          </Route>
        </Route>
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles="admin" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/tickets" element={<AllTickets />} />
            <Route path="/admin/comments" element={<AdminComments />} />
            <Route path="/admin/tickets/:id" element={<AdminTicketDetails />} />
            <Route path="/admin/engineers" element={<Engineers />} />
            <Route path="/admin/users" element={<Users />} />
          </Route>
        </Route>
      </Route>

      {/* Protected Engineer Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles="engineer" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/engineer/dashboard" element={<EngineerDashboard />} />
            <Route path="/engineer/comments" element={<EngineerComments />} />
            <Route path="/engineer/tickets/:id" element={<EngineerTicketDetails />} />
            <Route path="/engineer/profile" element={<EngineerProfile />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
