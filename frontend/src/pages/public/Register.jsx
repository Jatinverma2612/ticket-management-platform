import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../utils/helpers';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Ticket, Mail, Lock, User, UserPlus, Info, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      toast.success('Account created successfully! Welcome to TicketFlow.');
      navigate('/user/dashboard', { replace: true });
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
          Create standard user account
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          Submit and track technical support tickets with our engineering team
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xs border border-slate-200 hover:border-slate-300 transition-colors duration-150 rounded-2xl">
          {/* Informational notice */}
          <div className="mb-5 p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-900">
            <Info className="w-4 h-4 flex-shrink-0 text-brand-600 mt-0.5" />
            <span>
              Public registration provisions a standard <strong>User</strong> account. Administrator and Engineer roles are provisioned by system admins.
            </span>
          </div>

          <form className="space-y-4" onSubmit={handleRegister}>
            <Input
              label="Full Name"
              type="text"
              name="name"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Doe"
              icon={User}
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              icon={Mail}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
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

            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              id="confirmPassword"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              icon={Lock}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none focus:text-slate-700 transition-colors duration-150 p-1 rounded-md"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
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
                icon={UserPlus}
                size="md"
              >
                Create Account
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-sm text-slate-600">
            <span>Already have an account? </span>
            <Link
              to="/login"
              className="font-semibold text-brand-600 hover:text-brand-700 transition-colors duration-150 focus:outline-none focus:underline"
            >
              Sign in
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors duration-150 group focus:outline-none focus:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-150" />
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
