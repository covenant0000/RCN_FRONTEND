import { Link } from 'react-router-dom';
import {
  User, CalendarDays, BookOpen, Heart, ClipboardList,
  Flame, Bell, ArrowRight, ShieldCheck, CheckCircle2, Clock
} from 'lucide-react';

export const MemberWorkerDashboardView = ({
  user,
  events = [],
  sermons = [],
  rosters = [],
  donations = [],
  announcements = [],
}) => {
  const firstName = user?.profile?.firstName || 'Beloved';
  const lastName = user?.profile?.lastName || '';
  const isWorker = user?.role === 'WORKER' || user?.role === 'DEPARTMENT_HEAD';

  // Find rosters involving this worker/member
  const myRosters = rosters.filter((r) =>
    r.workers?.some((w) => w.profile?.firstName === firstName || w.id === user?.id)
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── 1. Member Profile & Status Card ───────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary-light to-surface text-white p-6 md:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-accent-gradient flex items-center justify-center font-display font-extrabold text-2xl md:text-3xl text-white shadow-lg shrink-0">
              {firstName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/20 text-accent border border-accent/30">
                  {user?.role || 'MEMBER'}
                </span>
                <span className="text-white/60 text-xs font-mono">Member ID: RCN-0089</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
                {firstName} {lastName}
              </h2>
              <p className="text-white/70 text-xs md:text-sm mt-0.5">
                Remnant Christian Network • Apostolic Mandate Community
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/give"
              className="btn-primary text-xs px-5 py-2.5"
            >
              <Heart className="w-4 h-4" /> Give Online
            </Link>
            <Link
              to="/prayer"
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-full border border-white/20 transition-all inline-flex items-center gap-1.5"
            >
              <Flame className="w-4 h-4 text-accent" /> Submit Prayer Request
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. Active Duty Roster for Workers ─────────────────────────────── */}
      {isWorker && (
        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-white/10">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">My Service Rosters</h3>
            </div>
            <Link to="/dashboard/rosters" className="text-xs text-accent font-semibold hover:underline">
              View Department Schedule
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(myRosters.length > 0 ? myRosters : [
              { id: 'ros-demo', serviceDate: 'Next Sunday, 8:00 AM', department: { name: 'Ushering & Protocol' }, notes: 'Main sanctuary sanctuary setup & welcoming' },
              { id: 'ros-demo-2', serviceDate: 'Wednesday Prayer Altar, 5:30 PM', department: { name: 'Intercession Team' }, notes: 'Pre-service intercessory watch' },
            ]).map((r) => (
              <div key={r.id} className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white text-xs md:text-sm">{r.department?.name || 'Sanctuary Team'}</p>
                  <p className="text-xs text-accent font-medium mt-0.5">{r.serviceDate}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{r.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 3. Upcoming Events & Sermons Feed ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Conferences */}
        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-accent" /> Upcoming Conferences
            </h3>
            <Link to="/events" className="text-xs text-accent font-semibold hover:underline">
              Browse All
            </Link>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-white/5">
            {events.slice(0, 3).map((evt) => (
              <Link
                key={evt.id}
                to={`/events/${evt.id}`}
                className="p-4 md:px-6 flex items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-accent text-white flex flex-col items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                    <span>{new Date(evt.startDate).toLocaleDateString('en-GB', { day: 'numeric' })}</span>
                    <span className="text-[10px] font-normal uppercase">{new Date(evt.startDate).toLocaleDateString('en-GB', { month: 'short' })}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-accent transition-colors truncate">
                      {evt.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{evt.location}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Sermons */}
        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" /> Latest Apostolic Sermons
            </h3>
            <Link to="/sermons" className="text-xs text-accent font-semibold hover:underline">
              Audio Archive
            </Link>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-white/5">
            {sermons.slice(0, 3).map((ser) => (
              <Link
                key={ser.id}
                to={`/sermons/${ser.id}`}
                className="p-4 md:px-6 flex items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-11 h-11 rounded-xl bg-cover bg-center shrink-0 shadow-sm"
                    style={{ backgroundImage: `url(${ser.thumbnailUrl})` }}
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-accent transition-colors truncate">
                      {ser.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{ser.speaker}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

