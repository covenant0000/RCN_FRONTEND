import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, CalendarDays, BookOpen, UserCheck, Bell,
  TrendingUp, Heart, ArrowRight, ShieldCheck, Flame,
  RefreshCw, LayoutDashboard, Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  membersAPI, eventsAPI, sermonsAPI, attendanceAPI,
  donationsAPI, firstTimersAPI, departmentsAPI, announcementsAPI, rostersAPI
} from '../../services/api';
import {
  mockMembers, mockEvents, mockSermons, mockAttendanceSummary,
  mockDonations, mockFirstTimers, mockDepartments, mockAnnouncements,
  mockRosters, mockPrayerRequests, mockAuditLogs, mockUsers
} from '../../services/mock/mockData';
import { PastorDashboardView } from '../../components/dashboard/PastorDashboardView';
import { AdminDashboardView } from '../../components/dashboard/AdminDashboardView';
import { SuperAdminDashboardView } from '../../components/dashboard/SuperAdminDashboardView';
import { MemberWorkerDashboardView } from '../../components/dashboard/MemberWorkerDashboardView';

const DashboardHome = () => {
  const { user, hasRole } = useAuth();
  const firstName = user?.profile?.firstName || 'Friend';
  const role = user?.role || 'MEMBER';

  // Role perspective switcher for elevated administrators
  const canSwitchPerspective = hasRole('PASTOR') || hasRole('ADMIN') || hasRole('SUPER_ADMIN');
  const [activePerspective, setActivePerspective] = useState(() => {
    if (role === 'SUPER_ADMIN') return 'SUPER_ADMIN';
    if (role === 'ADMIN') return 'ADMIN';
    if (role === 'PASTOR') return 'PASTOR';
    return 'MEMBER';
  });

  // Keep perspective in sync if user changes
  useEffect(() => {
    if (role === 'SUPER_ADMIN') setActivePerspective('SUPER_ADMIN');
    else if (role === 'ADMIN') setActivePerspective('ADMIN');
    else if (role === 'PASTOR') setActivePerspective('PASTOR');
    else setActivePerspective('MEMBER');
  }, [role]);

  // Unified state for real data
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState({
    members: mockMembers,
    events: mockEvents,
    sermons: mockSermons,
    attendance: mockAttendanceSummary,
    donations: mockDonations,
    firstTimers: mockFirstTimers,
    departments: mockDepartments,
    announcements: mockAnnouncements,
    rosters: mockRosters,
    prayerRequests: mockPrayerRequests,
    auditLogs: mockAuditLogs,
    users: mockUsers,
  });

  const loadDashboardData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      // Connect to existing backend API endpoints concurrently
      const [
        membersRes,
        eventsRes,
        sermonsRes,
        attendanceRes,
        donationsRes,
        firstTimersRes,
        departmentsRes,
      ] = await Promise.allSettled([
        membersAPI.getMembers(),
        eventsAPI.getEvents(),
        sermonsAPI.getSermons(),
        attendanceAPI.getAttendanceSummary(),
        donationsAPI.getDonations(),
        firstTimersAPI.getFirstTimers(),
        departmentsAPI.getDepartments(),
      ]);

      setData((prev) => ({
        ...prev,
        members: membersRes.status === 'fulfilled' && membersRes.value?.data?.data ? membersRes.value.data.data : mockMembers,
        events: eventsRes.status === 'fulfilled' && eventsRes.value?.data?.data ? eventsRes.value.data.data : mockEvents,
        sermons: sermonsRes.status === 'fulfilled' && sermonsRes.value?.data?.data ? sermonsRes.value.data.data : mockSermons,
        attendance: attendanceRes.status === 'fulfilled' && attendanceRes.value?.data?.data ? attendanceRes.value.data.data : mockAttendanceSummary,
        donations: donationsRes.status === 'fulfilled' && donationsRes.value?.data?.data ? donationsRes.value.data.data : mockDonations,
        firstTimers: firstTimersRes.status === 'fulfilled' && firstTimersRes.value?.data?.data ? firstTimersRes.value.data.data : mockFirstTimers,
        departments: departmentsRes.status === 'fulfilled' && departmentsRes.value?.data?.data ? departmentsRes.value.data.data : mockDepartments,
      }));
    } catch {
      // Fallback gracefully to actual mock records
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ── Dashboard Header ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              {role.replace('_', ' ')} PORTAL
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-mono hidden sm:inline-block">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time apostolic oversight, church operations & sanctuary analytics.
          </p>
        </div>

        {/* Action Controls & Role Perspective Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {canSwitchPerspective && (
            <div className="inline-flex items-center p-1 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs">
              <span className="px-2 text-[10px] uppercase font-bold text-gray-400 hidden lg:inline-block">
                View As:
              </span>
              {(role === 'SUPER_ADMIN' ? ['SUPER_ADMIN', 'ADMIN', 'PASTOR', 'MEMBER'] : role === 'ADMIN' ? ['ADMIN', 'PASTOR', 'MEMBER'] : ['PASTOR', 'MEMBER']).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setActivePerspective(p)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                    activePerspective === p
                      ? 'bg-white dark:bg-accent text-primary dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {p === 'SUPER_ADMIN' ? 'Super Admin' : p === 'ADMIN' ? 'Admin' : p === 'PASTOR' ? 'Pastor' : 'Member'}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => loadDashboardData(true)}
            disabled={refreshing}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:border-accent text-gray-600 dark:text-gray-300 hover:text-accent transition-all shrink-0"
            title="Refresh dashboard data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-accent' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── Active Role-Tailored Dashboard View ──────────────────────────── */}
      {loading ? (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-gray-100 dark:bg-white/5" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-72 rounded-2xl bg-gray-100 dark:bg-white/5" />
            <div className="h-72 rounded-2xl bg-gray-100 dark:bg-white/5" />
          </div>
        </div>
      ) : activePerspective === 'SUPER_ADMIN' ? (
        <SuperAdminDashboardView
          users={data.users}
          members={data.members}
          events={data.events}
          sermons={data.sermons}
          departments={data.departments}
          attendance={data.attendance}
          donations={data.donations}
          auditLogs={data.auditLogs}
        />
      ) : activePerspective === 'ADMIN' ? (
        <AdminDashboardView
          members={data.members}
          firstTimers={data.firstTimers}
          events={data.events}
          sermons={data.sermons}
          departments={data.departments}
          attendance={data.attendance}
          announcements={data.announcements}
          prayerRequests={data.prayerRequests}
          auditLogs={data.auditLogs}
        />
      ) : activePerspective === 'PASTOR' ? (
        <PastorDashboardView
          members={data.members}
          firstTimers={data.firstTimers}
          attendance={data.attendance}
          sermons={data.sermons}
          donations={data.donations}
          events={data.events}
          prayerRequests={data.prayerRequests}
          announcements={data.announcements}
          departments={data.departments}
        />
      ) : (
        <MemberWorkerDashboardView
          user={user}
          events={data.events}
          sermons={data.sermons}
          rosters={data.rosters}
          donations={data.donations}
          announcements={data.announcements}
        />
      )}
    </div>
  );
};

export default DashboardHome;
