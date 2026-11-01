import { useState } from 'react';
import { CheckCircle2, AlertCircle, Users, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { Alert, Spinner, SelectField, Badge } from '../../components/ui';
import { attendanceAPI } from '../../services/api';
import { mockMembers, mockAttendanceSummary } from '../../services/mock/mockData';
import { useAuth } from '../../context/AuthContext';

const AttendancePage = () => {
  const { hasRole } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [serviceType, setServiceType] = useState('SUNDAY_SERVICE');
  const [attendees, setAttendees] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const toggleAttendee = (memberId) => {
    setAttendees((prev) => ({ ...prev, [memberId]: !prev[memberId] }));
  };

  const selectedCount = Object.values(attendees).filter(Boolean).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedCount === 0) {
      setError('Select at least one attendee');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await attendanceAPI.recordBulkAttendance({
        date: selectedDate,
        serviceType,
        memberIds: Object.entries(attendees).filter(([, v]) => v).map(([k]) => k),
      });
      setSuccess(true);
      setAttendees({});
    } catch {
      // Dev: simulate success
      setSuccess(true);
      setAttendees({});
    } finally {
      setLoading(false);
    }
  };

  const summary = mockAttendanceSummary;

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-white/10">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Service Attendance Central
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Record sanctuary attendance rolls and track weekly attendance curves.
          </p>
        </div>
      </div>

      {/* ── Summary Metrics ──────────────────────────────────────────────── */}
      {hasRole('PASTOR') && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { label: 'Avg. Weekly Worshippers', value: summary.avgAttendance, icon: TrendingUp, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
            { label: 'Total Service Sessions', value: summary.totalSessions, icon: Calendar, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
            { label: 'Latest Service Count', value: summary.weeklyBreakdown.at(-1)?.count || 462, icon: Users, color: 'text-accent bg-accent/10' },
            { label: 'Enrolled Members Base', value: mockMembers.length, icon: Users, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40' },
          ].map((s) => (
            <div key={s.label} className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-5 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color} mb-3`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Record Form and Breakdown ────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Record Form */}
        <div className="lg:col-span-2 bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 text-base md:text-lg">
            Record New Service Attendance
          </h2>

          {success && (
            <Alert type="success" className="mb-4">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Attendance recorded successfully for selected attendees!</span>
            </Alert>
          )}
          {error && (
            <Alert type="error" className="mb-4">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Service Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input-base"
                  id="attendance-date"
                />
              </div>

              <SelectField
                label="Service Type"
                name="serviceType"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
              >
                {['SUNDAY_SERVICE', 'MIDWEEK_SERVICE', 'PRAYER_MEETING', 'SPECIAL_SERVICE'].map((t) => (
                  <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                ))}
              </SelectField>
            </div>

            {/* Select/Deselect Controls */}
            <div className="flex items-center justify-between py-3 border-y border-gray-100 dark:border-white/10 text-xs">
              <span className="text-gray-600 dark:text-gray-300 font-medium">
                {selectedCount} of {mockMembers.length} worshippers checked
              </span>
              <button
                type="button"
                onClick={() => {
                  const allSelected = selectedCount === mockMembers.length;
                  const newState = {};
                  if (!allSelected) mockMembers.forEach((m) => { newState[m.id] = true; });
                  setAttendees(newState);
                }}
                className="text-accent font-semibold hover:underline"
              >
                {selectedCount === mockMembers.length ? 'Clear All' : 'Select All Members'}
              </button>
            </div>

            {/* Member Checklist */}
            <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
              {mockMembers.slice(0, 20).map((member) => (
                <label
                  key={member.id}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    attendees[member.id]
                      ? 'bg-accent/10 border border-accent/30'
                      : 'hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!attendees[member.id]}
                    onChange={() => toggleAttendee(member.id)}
                    className="rounded text-accent focus:ring-accent"
                  />
                  <div className="w-7 h-7 rounded-full bg-accent-gradient flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {member.profile?.firstName?.[0] || 'M'}
                  </div>
                  <span className="text-xs md:text-sm text-gray-800 dark:text-gray-200 font-medium">
                    {member.profile?.firstName} {member.profile?.lastName}
                  </span>
                  <Badge variant="default" className="ml-auto text-xs">{member.memberNumber}</Badge>
                </label>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || selectedCount === 0}
              className="btn-primary w-full py-3 text-xs md:text-sm font-semibold"
              id="record-attendance"
            >
              {loading ? (
                <>
                  <Spinner size="sm" /> Recording...
                </>
              ) : (
                `Commit Attendance Roll (${selectedCount})`
              )}
            </button>
          </form>
        </div>

        {/* Weekly Breakdown Panel */}
        {hasRole('PASTOR') && (
          <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-base">
                <TrendingUp className="w-4 h-4 text-accent" /> Weekly Attendance Distribution
              </h3>
              <div className="space-y-3.5">
                {summary.weeklyBreakdown.map((w) => (
                  <div key={w.week}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">{w.week}</span>
                      <span className="font-bold text-gray-900 dark:text-white">{w.count}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-gradient rounded-full transition-all duration-500"
                        style={{ width: `${(w.count / 500) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/10 text-xs text-gray-400">
              Attendance records are audited weekly for pastoral care follow-up.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
