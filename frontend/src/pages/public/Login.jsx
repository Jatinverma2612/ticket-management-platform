import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLE_DEFAULT_ROUTES } from '../../utils/constants';
import { getErrorMessage } from '../../utils/helpers';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Ticket, Mail, Lock, LogIn, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error('Please enter both your email and password.');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(email.trim(), password);
      toast.success(`Welcome back, ${loggedUser.name}!`);

      // Redirect based on original destination or role default dashboard
      const redirectPath =
        location.state?.from?.pathname ||
        ROLE_DEFAULT_ROUTES[loggedUser.role] ||
        '/';
      navigate(redirectPath, { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-11 h-11 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-xs group-hover:bg-brand-700 transition-colors">
            <Ticket className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            TicketFlow
          </span>
        </Link>
        <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          Enter your authorized credentials to access your support workspace
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xs border border-slate-200 hover:border-slate-300 transition-colors duration-150 rounded-2xl">
          <form className="space-y-4" onSubmit={handleLogin}>
            <Input
              label="Email Address"
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@example.com"
              icon={Mail}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              icon={Lock}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none focus:text-slate-700 transition-colors duration-150 p-1 rounded-md"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-slate-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              }
            />

            <div className="pt-2">
              <Button
                type="submit"
                loading={loading}
                className="w-full"
                icon={LogIn}
                size="md"
              >
                Sign In
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-sm text-slate-600">
            <span>Don't have an account? </span>
            <Link
              to="/register"
              className="font-semibold text-brand-600 hover:text-brand-700 transition-colors duration-150 inline-flex items-center gap-0.5 group focus:outline-none focus:underline"
            >
              Sign up as standard user
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Internal Support & Issue Tracking Platform &bull; Secure JWT Session
        </p>
      </div>
    </div>
  );
};

export default Login;
