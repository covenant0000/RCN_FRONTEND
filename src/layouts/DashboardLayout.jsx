import { useState } from 'react';
import { Link, NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, CalendarDays, BookOpen, Megaphone,
  UserCheck, ClipboardList, Building2, CreditCard, User,
  LogOut, Menu, X, Flame, ChevronRight, Bell, Search,
  ExternalLink, Sparkles, CheckCircle2, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ui/ThemeToggle';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', end: true },
      { icon: User, label: 'My Profile', path: '/dashboard/profile' },
    ],
  },
  {
    label: 'Sanctuary Management',
    minRole: 'WORKER',
    items: [
      { icon: Users, label: 'Members', path: '/dashboard/members', minRole: 'WORKER' },
      { icon: UserCheck, label: 'Attendance', path: '/dashboard/attendance', minRole: 'WORKER' },
      { icon: Bell, label: 'First Timers', path: '/dashboard/first-timers', minRole: 'WORKER' },
      { icon: ClipboardList, label: 'Rosters', path: '/dashboard/rosters', minRole: 'WORKER' },
      { icon: Building2, label: 'Departments', path: '/dashboard/departments', minRole: 'DEPARTMENT_HEAD' },
    ],
  },
  {
    label: 'Publishing & Media',
    minRole: 'ADMIN',
    items: [
      { icon: CalendarDays, label: 'Events & Programs', path: '/dashboard/events', minRole: 'ADMIN' },
      { icon: Megaphone, label: 'Announcements', path: '/dashboard/announcements', minRole: 'ADMIN' },
      { icon: BookOpen, label: 'Sermons & Audio', path: '/dashboard/sermons', minRole: 'PASTOR' },
      { icon: CreditCard, label: 'Giving & Tithes', path: '/dashboard/donations', minRole: 'PASTOR' },
    ],
  },
  {
    label: 'Super Admin',
    minRole: 'SUPER_ADMIN',
    items: [
      { icon: ShieldCheck, label: 'Role Management', path: '/dashboard/roles', minRole: 'SUPER_ADMIN' },
    ],
  },
];

const DashboardLayout = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const roleLabelMap = {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Admin',
    PASTOR: 'Pastor',
    DEPARTMENT_HEAD: 'Dept. Head',
    WORKER: 'Worker',
    MEMBER: 'Member',
  };

  const currentRole = user?.role || 'MEMBER';

  // Resolve avatar: prefer uploaded photo stored in localStorage, fallback to initials
  const storedAvatar = user?.id
    ? localStorage.getItem(`rcn_avatar_${user.id}`) || user?.profile?.avatarUrl
    : null;

  const UserAvatar = ({ size = 'md', className = '' }) => {
    const sizeClasses = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
    const initial = user?.profile?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U';

    if (storedAvatar) {
      return (
        <img
          src={storedAvatar}
          alt="Profile"
          className={`${sizeClasses} rounded-full object-cover shadow-sm border-2 border-accent/30 ${className}`}
        />
      );
    }
    return (
      <div className={`${sizeClasses} rounded-xl bg-accent-gradient flex items-center justify-center text-white font-bold shrink-0 shadow-sm ${className}`}>
        {initial}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/80 dark:bg-[#09080e] flex transition-colors duration-300">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Modern SaaS Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-primary dark:bg-[#0c0a18] z-50 flex flex-col border-r border-white/5 dark:border-white/10 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 shadow-2xl lg:shadow-none`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-accent-gradient flex items-center justify-center shadow-md animate-pulse-glow shrink-0">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-base font-display tracking-tight flex items-center gap-1.5">
                RCN Portal
              </div>
              <div className="text-white/50 text-[11px] font-sans">
                Remnant Christian Network
              </div>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg lg:hidden text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Card */}
        <div className="p-4 mx-3 my-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <UserAvatar size="md" />
            <div className="min-w-0 flex-1">
              <div className="text-white text-xs md:text-sm font-semibold truncate">
                {user?.profile ? `${user.profile.firstName} ${user.profile.lastName}` : user?.email}
              </div>
              <div className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-accent/20 text-accent border border-accent/30 uppercase tracking-wider">
                {roleLabelMap[currentRole] || currentRole}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {navGroups.map((group) => {
            const visibleItems = group.items.filter(
              (item) => !item.minRole || hasRole(item.minRole)
            );
            if (visibleItems.length === 0) return null;
            return (
              <div key={group.label}>
                <div className="px-3 mb-2 text-[10px] font-bold text-white/40 uppercase tracking-widest font-sans">
                  {group.label}
                </div>
                <div className="space-y-1">
                  {visibleItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-accent text-white shadow-md shadow-accent/20 font-semibold'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }`
                      }
                    >
                      <span className="flex items-center gap-3">
                        <item.icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                        <span>{item.label}</span>
                      </span>
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-1.5 bg-black/10">
          <Link
            to="/"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-white/70 hover:bg-white/10 hover:text-white transition-all"
          >
            <span className="flex items-center gap-2.5">
              <ExternalLink className="w-3.5 h-3.5 text-accent" /> Back to Main Website
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-all font-medium"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Modern SaaS Header */}
        <header className="bg-white/95 dark:bg-[#0c0a18]/95 backdrop-blur-md border-b border-gray-100 dark:border-white/10 px-4 md:px-8 h-18 flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Section Indicator */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-400 dark:text-gray-500">
              <span className="text-gray-800 dark:text-gray-200 font-semibold capitalize">
                {location.pathname.replace('/dashboard', '') ? location.pathname.replace('/dashboard/', '').replace('-', ' ') : 'Overview'}
              </span>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Quick Visit Site Button */}
            <Link
              to="/"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-accent border border-gray-200 dark:border-white/10 hover:border-accent transition-all"
            >
              <span>Sanctuary Portal</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent ring-2 ring-white dark:ring-[#0c0a18]" />
              </button>

              {/* Notifications Dropdown Drawer */}
              {notifOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#12101e] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 p-4 z-50 animate-fade-in"
                  onClick={() => setNotifOpen(false)}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/10 mb-3">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">Announcements & Alerts</span>
                    <span className="text-[11px] text-accent font-semibold">3 New</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5">
                      <p className="font-semibold text-gray-900 dark:text-white">Sunday Attendance Finalized</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">462 worshippers recorded across both services.</p>
                      <span className="text-[10px] text-gray-400">1 hour ago</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5">
                      <p className="font-semibold text-gray-900 dark:text-white">IEC 2025 Registration Open</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Conferences pipeline published on public portal.</p>
                      <span className="text-[10px] text-gray-400">3 hours ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Black & White Theme Toggle */}
            <ThemeToggle />

            {/* User Avatar — shows uploaded photo if available */}
            <Link
              to="/dashboard/profile"
              className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              title="View my profile"
            >
              {storedAvatar ? (
                <img
                  src={storedAvatar}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-accent/30 shadow-sm"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-accent-gradient flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  {user?.profile?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </Link>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 md:p-8 lg:p-10 transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
