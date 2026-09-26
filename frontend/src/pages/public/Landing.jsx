import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Ticket,
  ArrowRight,
  Shield,
  Wrench,
  User,
  Clock,
  MessageSquare,
  Activity,
  CheckCircle2,
  ChevronRight,
  Layers,
  Sparkles,
  Lock,
  GitBranch,
  Menu,
  X,
} from 'lucide-react';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/tickets/StatusBadge';

const Landing = () => {
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'engineer':
        return '/engineer/dashboard';
      default:
        return '/user/dashboard';
    }
  };

  const navLinks = [
    { href: '#platform', label: 'Platform' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#features', label: 'Features' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 selection:bg-brand-100 selection:text-brand-900">
      {/* 2 & 3. POLISHED SAAS NAVBAR (DESKTOP + MOBILE) */}
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Brand + Desktop Navigation */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-xs group-hover:bg-brand-700 transition-colors">
                <Ticket className="w-4 h-4" />
              </div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                TicketFlow
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="hover:text-brand-600 transition-colors duration-150 py-1 focus:outline-none focus:text-brand-600"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Right: Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link to={getDashboardPath()}>
                <Button size="sm" icon={ArrowRight}>
                  Open Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 font-medium">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-brand-600 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {isAuthenticated ? (
                <Link to={getDashboardPath()} onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full justify-center" icon={ArrowRight}>
                    Open Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full justify-center">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full justify-center">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* 1. HERO SECTION & 2. HERO VISUAL (STATIC PRODUCT PREVIEW CARD) */}
        <section className="pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24 border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column: Value Proposition & CTAs */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200/80">
                  <Shield className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span>Internal Technical Support & Issue Resolution</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.18]">
                  Structured support ticket management for{' '}
                  <span className="text-brand-600">modern engineering teams</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  TicketFlow enforces predictable lifecycle progression, dedicated role-based workbenches, and immutable audit logging for rapid, accountable issue resolution.
                </p>

                {/* Primary & Secondary CTAs */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3">
                  <Link to={isAuthenticated ? getDashboardPath() : '/register'} className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto" icon={ArrowRight}>
                      {isAuthenticated ? 'Go to My Workspace' : 'Create Free Account'}
                    </Button>
                  </Link>
                  <Link to="/login" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Sign In to Portal
                    </Button>
                  </Link>
                </div>

                {/* Trust / Core Signals */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                    Strict 5-Stage Lifecycle
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                    Role-Based Access Control
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                    Complete Activity Audit Log
                  </span>
                </div>
              </div>

              {/* Right Column: Static Product Preview Composition (Ticket Details) */}
              <div className="lg:col-span-5">
                <div className="mx-auto max-w-lg lg:max-w-none bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden transition-all duration-150 hover:border-slate-300 hover:shadow-lg">
                  {/* Window Bar */}
                  <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      </div>
                      <span className="text-xs font-semibold text-slate-600 ml-2 font-mono">
                        Ticket Details Preview
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400">
                      Product Preview
                    </span>
                  </div>

                  {/* Static Ticket Details Content */}
                  <div className="p-5 space-y-4">
                    {/* Title & Ticket ID */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-mono text-xs text-slate-400 font-medium">
                          #54F02E94
                        </span>
                        <StatusBadge status="Assigned" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        Login issue on my account
                      </h3>
                    </div>

                    {/* Structured Key-Value Metadata Grid */}
                    <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                          Status
                        </span>
                        <span className="font-semibold text-blue-700">Assigned</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                          Priority
                        </span>
                        <span className="font-semibold text-rose-700">High</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                          Category
                        </span>
                        <span className="font-medium text-slate-700">Technical Support</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                          Engineer
                        </span>
                        <span className="font-medium text-slate-800">Sarah Connor</span>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="space-y-1.5 pt-1 border-t border-slate-100 text-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Recent Activity
                      </span>
                      <div className="flex items-center gap-2 text-slate-700 font-medium">
                        <Activity className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>Ticket assigned to engineer</span>
                      </div>
                    </div>

                    {/* Comments Indicator */}
                    <div className="space-y-1.5 pt-1 border-t border-slate-100 text-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Comments
                      </span>
                      <div className="flex items-center gap-2 text-slate-600">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>2 comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ROLE-BASED FEATURES SECTION */}
        <section id="platform" className="py-16 sm:py-20 bg-slate-50 scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-2 block">
                Role-Based Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Designed for every support stakeholder
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600">
                Tailored workbenches strictly limit permissions and keep workflows focused on the task at hand.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* User Card */}
              <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all space-y-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-100">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-0.5">
                    User Portal
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">User Workspace</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Submit technical issues with priority and category details, with direct visibility into real-time progress.
                </p>
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Create support tickets</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Track ticket status</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Communicate through comments</span>
                  </div>
                </div>
              </div>

              {/* Engineer Card */}
              <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all space-y-4">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block mb-0.5">
                    Engineer Portal
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">Engineer Workbench</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Focus on assigned tickets with dedicated investigative controls, technical notes, and resolution actions.
                </p>
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>View assigned tickets</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Investigate issues</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Add updates and resolutions</span>
                  </div>
                </div>
              </div>

              {/* Admin Card */}
              <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all space-y-4">
                <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold border border-rose-100">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block mb-0.5">
                    Admin Portal
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">Admin Operations</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Complete operational authority to inspect queues, dispatch available engineers, adjust priorities, and audit timelines.
                </p>
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Manage all tickets</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Assign engineers</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Monitor ticket operations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. HOW IT WORKS */}
        <section id="how-it-works" className="py-16 sm:py-20 bg-white border-t border-slate-200 scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-2 block">
                Workflow Process
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                How support requests move through TicketFlow
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600">
                A transparent, 3-step sequence ensures every reported ticket is triaged, resolved, and documented.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-slate-300 hover:bg-white hover:shadow-xs transition-all duration-150 space-y-3">
                <span className="text-2xl font-extrabold text-brand-600 font-mono">01</span>
                <h3 className="text-lg font-bold text-slate-900">Create</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  User submits a support ticket with descriptive details, category, and an initial priority level.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-slate-300 hover:bg-white hover:shadow-xs transition-all duration-150 space-y-3">
                <span className="text-2xl font-extrabold text-brand-600 font-mono">02</span>
                <h3 className="text-lg font-bold text-slate-900">Resolve</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  An assigned engineer investigates the issue, documents findings in comments, and transitions the state to Resolved.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-slate-300 hover:bg-white hover:shadow-xs transition-all duration-150 space-y-3">
                <span className="text-2xl font-extrabold text-brand-600 font-mono">03</span>
                <h3 className="text-lg font-bold text-slate-900">Close</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  The issue is confirmed resolved and the ticket is officially closed by the system administrator.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. TICKET LIFECYCLE */}
        <section id="features" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200 scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-2 block">
                Lifecycle State Machine
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Enforced 5-stage lifecycle progression
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600">
                Tickets must transition through sequential stages without skips, ensuring complete operational clarity.
              </p>
            </div>

            {/* Lifecycle Flow Horizontal Track */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 max-w-5xl mx-auto">
              {/* Stage 1: Open */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-150 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center font-mono">
                      1
                    </span>
                    <StatusBadge status="Open" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Open</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Newly submitted ticket awaiting administrator triage and assignment.
                </p>
              </div>

              {/* Stage 2: Assigned */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-150 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center font-mono">
                      2
                    </span>
                    <StatusBadge status="Assigned" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Assigned</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Admin assigns a specific active engineer to handle the request.
                </p>
              </div>

              {/* Stage 3: In Progress */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-150 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold flex items-center justify-center font-mono">
                      3
                    </span>
                    <StatusBadge status="In Progress" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">In Progress</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Engineer is actively investigating and developing a remediation.
                </p>
              </div>

              {/* Stage 4: Resolved */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-150 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center font-mono">
                      4
                    </span>
                    <StatusBadge status="Resolved" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Resolved</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Engineer marks the issue fixed and attaches relevant technical notes.
                </p>
              </div>

              {/* Stage 5: Closed */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-150 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center font-mono">
                      5
                    </span>
                    <StatusBadge status="Closed" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Closed</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Admin completes the final review and locks the ticket lifecycle.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. CORE CAPABILITIES */}
        <section className="py-16 sm:py-20 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-2 block">
                Platform Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Core capabilities built for reliability
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600">
                Every component is designed to enforce operational consistency across your engineering workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-150 space-y-2.5">
                <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Role-Based Access Control
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Strict authorization boundaries separate User, Engineer, and Admin portals backed by JWT-secured endpoints.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-150 space-y-2.5">
                <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
                  <GitBranch className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Ticket Lifecycle Tracking
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Rigid state machine prevents invalid transitions, enforcing Open → Assigned → In Progress → Resolved → Closed.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-150 space-y-2.5">
                <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Engineer Assignment
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Admins assign tickets directly to qualified engineers with active availability and workload management.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-150 space-y-2.5">
                <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Comments & Responses
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Centralized discussion thread on every ticket with dedicated unread inbox badges for Admin and Engineer portals.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="p-6 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-150 space-y-2.5">
                <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Activity History
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Timestamped, immutable audit log recording every status change, engineer dispatch, and priority adjustment.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="p-6 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-150 space-y-2.5">
                <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Priority Management
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Granular priority tiers (Low, Medium, High) enable teams to triage critical blockers from routine inquiries.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. FINAL CTA */}
        <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Ready to manage support requests more efficiently?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              Experience structured issue tracking, role-scoped workflows, and accountable ticket lifecycle management.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to={isAuthenticated ? getDashboardPath() : '/register'} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto" icon={ArrowRight}>
                  {isAuthenticated ? 'Go to My Workspace' : 'Create Free Account'}
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 9. FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <div className="w-6 h-6 rounded-md bg-brand-600 text-white flex items-center justify-center">
              <Ticket className="w-3.5 h-3.5" />
            </div>
            <span>TicketFlow</span>
            <span className="text-slate-300 font-normal hidden sm:inline">&bull;</span>
            <span className="text-slate-500 font-normal hidden sm:inline">
              Internal Technical Support & Issue Resolution
            </span>
          </div>

          <p className="text-slate-400">
            &copy; 2026 TicketFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
