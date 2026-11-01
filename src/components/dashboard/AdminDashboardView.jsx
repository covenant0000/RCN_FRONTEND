import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, UserCheck, CalendarDays, BookOpen, Building2,
  Bell, CheckCircle2, AlertTriangle, Clock, ArrowRight,
  Plus, Shield, Activity, FileSpreadsheet, UserPlus
} from 'lucide-react';
import { MetricCard, TrendAreaChart, ComparisonBarChart, DonutChart } from './DashboardCharts';

export const AdminDashboardView = ({
  members = [],
  firstTimers = [],
  events = [],
  sermons = [],
  departments = [],
  attendance = {},
  announcements = [],
  prayerRequests = [],
  auditLogs = [],
}) => {
  const [trendPeriod, setTrendPeriod] = useState('30D');

  // Compute operational statistics
  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === 'ACTIVE').length;
  const inactiveMembers = members.filter((m) => m.status === 'INACTIVE').length;
  const pendingApprovals = members.filter((m) => m.status === 'VISITOR').length;

  const totalEvents = events.length;
  const publishedEvents = events.filter((e) => e.status === 'PUBLISHED').length;

  // Monthly registrations trend data
  const registrationTrendData = [
    { label: '01 Jan', value: 8 },
    { label: '04 Jan', value: 14 },
    { label: '07 Jan', value: 11 },
    { label: '10 Jan', value: 19 },
    { label: '13 Jan', value: 24 },
    { label: '16 Jan', value: 22 },
    { label: '19 Jan', value: 29 },
  ];

  // Department distribution
  const departmentStats = departments.map((d, i) => ({
    label: d.name,
    value: d.memberCount || 20 + i * 5,
    sub: `${d.memberCount || 20 + i * 5} members`,
  }));

  // Pending administrative tasks checklist
  const pendingTasks = [
    {
      id: 'task-1',
      title: 'Review 8 Pending Membership Applications',
      category: 'Members',
      due: 'Today, 5:00 PM',
      priority: 'HIGH',
      link: '/dashboard/members',
    },
    {
      id: 'task-2',
      title: 'Submit Sunday 2nd Service Attendance Roll',
      category: 'Attendance',
      due: 'Tomorrow, 12:00 PM',
      priority: 'MEDIUM',
      link: '/dashboard/attendance',
    },
    {
      id: 'task-3',
      title: 'Prepare Ushers & Sound Engineers Roster',
      category: 'Roster',
      due: 'Friday, 6:00 PM',
      priority: 'HIGH',
      link: '/dashboard/rosters',
    },
    {
      id: 'task-4',
      title: 'Verify IEC 2025 Venue Logistics',
      category: 'Events',
      due: 'In 3 days',
      priority: 'LOW',
      link: '/dashboard/events',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── 1. Administrative Overview KPIs ───────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Church Operations & Management Overview
          </h2>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full">
            Admin Console
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          <MetricCard
            icon={Users}
            label="Total Registry"
            value={totalMembers.toLocaleString()}
            change="+11.3%"
            isPositive={true}
            subtext={`${activeMembers} active / ${inactiveMembers} inactive`}
            color="bg-primary/10 text-primary dark:text-accent"
            linkTo="/dashboard/members"
          />

          <MetricCard
            icon={UserPlus}
            label="Pending Approvals"
            value={pendingApprovals.toLocaleString()}
            change="-4.2%"
            isPositive={true}
            subtext="Awaiting membership induction"
            color="bg-amber-500/10 text-amber-600 dark:text-amber-400"
            linkTo="/dashboard/members"
          />

          <MetricCard
            icon={CalendarDays}
            label="Events In Pipeline"
            value={totalEvents.toLocaleString()}
            change="+3"
            isPositive={true}
            subtext={`${publishedEvents} published publicly`}
            color="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            linkTo="/dashboard/events"
          />

          <MetricCard
            icon={Building2}
            label="Active Departments"
            value={departments.length.toLocaleString()}
            change="100%"
            isPositive={true}
            subtext="Fully staffed ministries"
            color="bg-purple-500/10 text-purple-600 dark:text-purple-400"
            linkTo="/dashboard/departments"
          />
        </div>
      </div>

      {/* ── 2. Operational Visual Analytics ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendAreaChart
            title="Member Registration Velocity"
            subtitle="Daily and weekly incoming new member records"
            data={registrationTrendData}
            valueSuffix=" new converts"
            periods={['7D', '30D', '90D', '1Y']}
            selectedPeriod={trendPeriod}
            onPeriodChange={setTrendPeriod}
            color="#1D1747"
          />
        </div>

        <div>
          <ComparisonBarChart
            title="Department Staffing Strength"
            subtitle="Personnel deployment by ministry"
            data={departmentStats}
            barColor="bg-primary-light"
          />
        </div>
      </div>

      {/* ── 3. Administrative Action Center: Tasks & Audit Feed ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Administrative Action Checklist */}
        <div className="lg:col-span-2 bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                  Action Required & Pending Workflows
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                {pendingTasks.length} Urgent Items
              </span>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {pendingTasks.map((task) => (
                <div key={task.id} className="p-4 md:px-6 flex items-center justify-between gap-4 hover:bg-gray-50/70 dark:hover:bg-white/5 transition-colors">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                      task.priority === 'HIGH' ? 'bg-rose-500 ring-4 ring-rose-100 dark:ring-rose-950/40' : 'bg-amber-400'
                    }`} />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{task.title}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        <span className="font-medium text-accent">{task.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {task.due}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={task.link}
                    className="btn-primary text-xs px-3.5 py-1.5 shrink-0"
                  >
                    Action <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 px-6 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">Workflow automation syncs every 15 minutes</span>
            <span className="text-accent font-medium">All queues running normally</span>
          </div>
        </div>

        {/* Recent Admin Audit Activity Feed */}
        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-gray-900 dark:text-white text-base">Activity Audit Feed</h3>
              </div>
              <span className="text-xs text-gray-400">Real-time</span>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Latest administrative operations performed across departments.
            </p>

            <div className="space-y-3.5">
              {(auditLogs.length > 0 ? auditLogs : [
                { id: '1', user: 'Operations Admin', action: 'Approved Member Induction', target: 'RCN0028', timestamp: '15m ago' },
                { id: '2', user: 'Pastor Arome', action: 'Added Sermon Outline', target: 'The Mystery of Grace', timestamp: '1h ago' },
                { id: '3', user: 'Media Lead', action: 'Updated Audio Roster', target: 'Sound Team', timestamp: '3h ago' },
                { id: '4', user: 'Ushering Head', action: 'Submitted Attendance', target: 'Sunday 1st Service', timestamp: 'Yesterday' },
              ]).slice(0, 4).map((log) => (
                <div key={log.id} className="text-xs pb-3 border-b border-gray-100 dark:border-white/5 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mb-0.5">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{log.user}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium">{log.action}</p>
                  <p className="text-[11px] text-accent truncate">{log.target}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-white/10">
            <Link to="/dashboard/members" className="text-accent text-xs font-semibold hover:underline inline-flex items-center gap-1">
              View Detailed Audit Registry <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── 4. Admin Management Fast Shortcuts ────────────────────────────── */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-primary to-primary-light text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-xl font-bold mb-1">Administrative Quick Controls</h3>
            <p className="text-white/70 text-xs md:text-sm">
              Instant shortcuts to create records, dispatch notifications, and generate reports.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/dashboard/members"
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition-all inline-flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" /> Add New Member
            </Link>

            <Link
              to="/dashboard/events"
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition-all inline-flex items-center gap-1.5"
            >
              <CalendarDays className="w-4 h-4" /> Schedule Event
            </Link>

            <Link
              to="/dashboard/attendance"
              className="btn-primary text-xs px-5 py-2.5"
            >
              <FileSpreadsheet className="w-4 h-4" /> Log Service Attendance
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

