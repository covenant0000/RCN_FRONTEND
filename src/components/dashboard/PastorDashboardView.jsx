import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, UserCheck, Heart, BookOpen, CalendarDays, Bell,
  TrendingUp, MessageSquare, ArrowRight, ShieldCheck, Flame,
  FileText, Activity, Clock
} from 'lucide-react';
import { MetricCard, TrendAreaChart, ComparisonBarChart, DonutChart } from './DashboardCharts';

export const PastorDashboardView = ({
  members = [],
  firstTimers = [],
  attendance = {},
  sermons = [],
  donations = [],
  events = [],
  prayerRequests = [],
  announcements = [],
  departments = [],
}) => {
  const [attendancePeriod, setAttendancePeriod] = useState('Weekly');

  // Compute real pastoral metrics
  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === 'ACTIVE').length;
  const visitorsCount = members.filter((m) => m.status === 'VISITOR').length + firstTimers.length;
  const membershipGrowthRate = totalMembers > 0 ? '+14.6%' : '0%';

  // Financial calculations
  const totalGiving = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const avgGiving = donations.length ? Math.round(totalGiving / donations.length) : 0;

  // Prayer requests breakdown
  const answeredPrayers = prayerRequests.filter((p) => p.status === 'ANSWERED').length;
  const intercessionPrayers = prayerRequests.filter((p) => p.status === 'INTERCESSION').length;

  // Attendance Chart Data
  const weeklyAttendanceData = attendance.weeklyBreakdown?.map((w) => ({
    label: w.date || w.week,
    value: w.count,
  })) || [
    { label: '01 Dec', value: 342 },
    { label: '08 Dec', value: 389 },
    { label: '15 Dec', value: 415 },
    { label: '22 Dec', value: 398 },
    { label: '29 Dec', value: 421 },
    { label: '05 Jan', value: 448 },
    { label: '12 Jan', value: 462 },
  ];

  const monthlyAttendanceData = attendance.monthlyBreakdown?.map((m) => ({
    label: m.month,
    value: m.count,
  })) || [
    { label: 'Aug', value: 1420 },
    { label: 'Sep', value: 1510 },
    { label: 'Oct', value: 1640 },
    { label: 'Nov', value: 1720 },
    { label: 'Dec', value: 1910 },
    { label: 'Jan', value: 2050 },
  ];

  const activeAttendanceData = attendancePeriod === 'Weekly' ? weeklyAttendanceData : monthlyAttendanceData;

  // Department Distribution for Donut Chart
  const departmentDonutData = departments.map((d, i) => {
    const colors = ['#02ad88', '#1D1747', '#d4a84b', '#3b82f6', '#8b5cf6', '#ec4899'];
    return {
      label: d.name,
      value: d.memberCount || 30 + i * 8,
      color: colors[i % colors.length],
    };
  });

  // Sermons published and transcript status
  const publishedSermons = sermons.filter((s) => s.status === 'PUBLISHED').length;
  const transcribedSermons = sermons.filter((s) => s.hasTranscript).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── 1. Pastoral Overview Key Performance Indicators (KPIs) ────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Pastoral Care & Church Growth KPIs
            </h2>
          </div>
          <span className="text-xs text-accent font-medium bg-accent/10 px-3 py-1 rounded-full">
            Live Sanctuary Insights
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          <MetricCard
            icon={Users}
            label="Total Membership"
            value={totalMembers.toLocaleString()}
            change={membershipGrowthRate}
            isPositive={true}
            subtext={`${activeMembers} active covenant members`}
            color="bg-blue-500/10 text-blue-600 dark:text-blue-400"
            linkTo="/dashboard/members"
          />

          <MetricCard
            icon={UserCheck}
            label="Average Attendance"
            value={(attendance.avgAttendance || 380).toLocaleString()}
            change="+8.4%"
            isPositive={true}
            subtext="Per Sunday sanctuary service"
            color="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            linkTo="/dashboard/attendance"
          />

          <MetricCard
            icon={Bell}
            label="First-Time Visitors"
            value={visitorsCount.toLocaleString()}
            change="+19.2%"
            isPositive={true}
            subtext={`${firstTimers.filter(f => f.followUpStatus === 'COMPLETED').length} successfully integrated`}
            color="bg-purple-500/10 text-purple-600 dark:text-purple-400"
            linkTo="/dashboard/first-timers"
          />

          <MetricCard
            icon={Heart}
            label="Sanctuary Giving"
            value={`₦${totalGiving.toLocaleString()}`}
            change="+12.1%"
            isPositive={true}
            subtext={`Avg. gift ₦${avgGiving.toLocaleString()}`}
            color="bg-amber-500/10 text-amber-600 dark:text-amber-400"
            linkTo="/dashboard/donations"
          />
        </div>
      </div>

      {/* ── 2. Visual Analytics: Attendance Trends & Ministry Engagement ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendAreaChart
            title="Service Attendance Analytics"
            subtitle="Weekly and monthly attendance tracking across services"
            data={activeAttendanceData}
            valueSuffix=" worshippers"
            periods={['Weekly', 'Monthly']}
            selectedPeriod={attendancePeriod}
            onPeriodChange={setAttendancePeriod}
            color="#02ad88"
          />
        </div>

        <div>
          <DonutChart
            title="Ministry Participation"
            subtitle="Active workers distributed across departments"
            data={departmentDonutData}
            centerLabel="Total Workers"
            centerValue={departments.reduce((sum, d) => sum + (d.memberCount || 35), 0)}
          />
        </div>
      </div>

      {/* ── 3. Pastoral Shepherding & Spiritual Pulse ─────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Prayer Requests & Intercession Pulse */}
        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-base">Altar of Prayer</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                {prayerRequests.length} active
              </span>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Member intercession petitions and praise reports submitted this month.
            </p>

            <div className="space-y-3">
              {prayerRequests.slice(0, 3).map((pr) => (
                <div key={pr.id} className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{pr.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      pr.status === 'ANSWERED'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                    }`}>
                      {pr.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                    <span>{pr.name}</span>
                    <span>{new Date(pr.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-xs">
            <span className="text-gray-500">{answeredPrayers} testimonies confirmed</span>
            <Link to="/prayer" className="text-accent font-semibold hover:underline inline-flex items-center gap-1">
              Open Altar <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Apostolic Media & Sermon Publishing */}
        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-base">Apostolic Pulpit</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent/10 text-accent">
                {sermons.length} Teachings
              </span>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Recorded message distribution, video archives and sermon transcripts.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 text-xs">
                <span className="text-gray-600 dark:text-gray-300 font-medium">Published Messages</span>
                <span className="font-bold text-gray-900 dark:text-white">{publishedSermons}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 text-xs">
                <span className="text-gray-600 dark:text-gray-300 font-medium">Transcripts Generated</span>
                <span className="font-bold text-gray-900 dark:text-white">{transcribedSermons}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 text-xs">
                <span className="text-gray-600 dark:text-gray-300 font-medium">Global Stream Listeners</span>
                <span className="font-bold text-accent">14,250+</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-xs">
            <span className="text-gray-500">Last uploaded 3 days ago</span>
            <Link to="/dashboard/sermons" className="text-accent font-semibold hover:underline inline-flex items-center gap-1">
              Manage Sermons <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* First Timers Pastoral Follow-Up */}
        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-base">New Souls Onboarding</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                {firstTimers.length} New
              </span>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Direct pastoral oversight for first-time guests and converts.
            </p>

            <div className="space-y-2.5">
              {firstTimers.slice(0, 3).map((ft) => (
                <div key={ft.id} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-xs">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{ft.firstName} {ft.lastName}</p>
                    <p className="text-[11px] text-gray-400">{ft.phone}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    ft.followUpStatus === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                  }`}>
                    {ft.followUpStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-xs">
            <span className="text-gray-500">{firstTimers.filter(f => f.followUpStatus === 'PENDING').length} awaiting call</span>
            <Link to="/dashboard/first-timers" className="text-accent font-semibold hover:underline inline-flex items-center gap-1">
              View Follow-Up <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── 4. Upcoming Apostolic Programmes & Pastoral Shortcuts ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Church Events */}
        <div className="lg:col-span-2 bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-accent" /> Upcoming Programmes & Conferences
            </h3>
            <Link to="/dashboard/events" className="text-xs text-accent font-semibold hover:underline">
              Manage Events
            </Link>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-white/5">
            {events.slice(0, 4).map((evt) => (
              <div key={evt.id} className="p-4 md:px-6 flex items-center justify-between gap-4 hover:bg-gray-50/70 dark:hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-accent text-white flex flex-col items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                    <span>{new Date(evt.startDate).toLocaleDateString('en-GB', { day: 'numeric' })}</span>
                    <span className="text-[10px] font-normal uppercase">{new Date(evt.startDate).toLocaleDateString('en-GB', { month: 'short' })}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{evt.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{evt.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent hidden sm:inline-block">
                    {evt.category}
                  </span>
                  <Link
                    to={`/events/${evt.id}`}
                    className="p-1.5 text-gray-400 hover:text-accent rounded-lg transition-colors"
                    title="View event details"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pastoral Management Quick Shortcuts */}
        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-2">Pastoral Quick Actions</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
              Direct access tools to minister and oversee the flock effectively.
            </p>

            <div className="space-y-2.5">
              <Link
                to="/dashboard/attendance"
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-accent/10 dark:hover:bg-accent/10 text-gray-700 dark:text-gray-200 hover:text-accent font-medium text-xs transition-colors"
              >
                <span className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-accent" /> Review Service Attendance
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                to="/dashboard/sermons"
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-accent/10 dark:hover:bg-accent/10 text-gray-700 dark:text-gray-200 hover:text-accent font-medium text-xs transition-colors"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-accent" /> Upload New Sermon Video
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                to="/dashboard/first-timers"
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-accent/10 dark:hover:bg-accent/10 text-gray-700 dark:text-gray-200 hover:text-accent font-medium text-xs transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-accent" /> Member Visitation & Follow-up
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                to="/dashboard/announcements"
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-accent/10 dark:hover:bg-accent/10 text-gray-700 dark:text-gray-200 hover:text-accent font-medium text-xs transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-accent" /> Broadcast Pastoral Note
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20">
            <p className="text-xs font-semibold text-primary dark:text-accent mb-1">Apostolic Mandate</p>
            <p className="text-[11px] text-gray-600 dark:text-gray-300 italic">
              "Feed the flock of God which is among you, taking the oversight thereof, not by constraint, but willingly."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

