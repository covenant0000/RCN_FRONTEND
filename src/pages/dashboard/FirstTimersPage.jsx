import { useState } from 'react';
import { Plus, Eye, Edit, CheckCircle, Clock, Bell, UserPlus, PhoneCall, CheckCheck } from 'lucide-react';
import { Badge, LoadingScreen, EmptyState, Modal, FormField } from '../../components/ui';
import { mockFirstTimers } from '../../services/mock/mockData';
import { firstTimersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const followUpVariant = {
  PENDING: 'warning',
  CONTACTED: 'accent',
  COMPLETED: 'success',
};

const FirstTimersPage = () => {
  const { hasRole } = useAuth();
  const [data, setData] = useState(mockFirstTimers);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '', address: '' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const created = {
      id: `ft-new-${Date.now()}`,
      ...form,
      visitDate: new Date().toISOString(),
      followUpStatus: 'PENDING',
      notes: 'Sanctuary first-time visitor',
    };

    try {
      await firstTimersAPI.registerFirstTimer(created);
    } catch {
      // Dev fallback
    } finally {
      setData((prev) => [created, ...prev]);
      setShowModal(false);
      setForm({ firstName: '', lastName: '', phone: '', email: '', address: '' });
      setLoading(false);
    }
  };

  const updateFollowUp = async (id, status) => {
    try {
      await firstTimersAPI.updateFirstTimer(id, { followUpStatus: status });
    } catch {
      // Continue locally
    }
    setData((prev) => prev.map((ft) => ft.id === id ? { ...ft, followUpStatus: status } : ft));
  };

  const pendingCount = data.filter((d) => d.followUpStatus === 'PENDING').length;
  const contactedCount = data.filter((d) => d.followUpStatus === 'CONTACTED').length;
  const completedCount = data.filter((d) => d.followUpStatus === 'COMPLETED').length;

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-white/10">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            First-Time Visitors & Integration
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Follow up with new guests, track assimilation and integrate into foundation classes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="btn-primary text-xs px-5 py-2.5 shrink-0 self-start sm:self-auto"
          id="add-firsttimer"
        >
          <Plus className="w-4 h-4" /> Register New Visitor
        </button>
      </div>

      {/* ── Summary Counters ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
            <Bell className="w-4 h-4 text-primary dark:text-accent" />
            <span>Total Visitors</span>
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{data.length}</p>
        </div>

        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Awaiting Call</span>
          </div>
          <p className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingCount}</p>
        </div>

        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
            <PhoneCall className="w-4 h-4 text-blue-500" />
            <span>In Conversation</span>
          </div>
          <p className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">{contactedCount}</p>
        </div>

        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
            <CheckCheck className="w-4 h-4 text-emerald-500" />
            <span>Fully Integrated</span>
          </div>
          <p className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">{completedCount}</p>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────── */}
      {data.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No first-time visitors recorded"
          message="Register a new visitor using the button above."
        />
      ) : (
        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm text-left">
              <thead className="border-b border-gray-100 dark:border-white/10 bg-gray-50/70 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Guest Information</th>
                  <th className="px-5 py-3.5 hidden sm:table-cell">Contact Details</th>
                  <th className="px-5 py-3.5 hidden md:table-cell">Service Date</th>
                  <th className="px-5 py-3.5">Assimilation Status</th>
                  <th className="px-5 py-3.5 text-right">Advance Workflow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {data.map((ft) => (
                  <tr key={ft.id} className="hover:bg-gray-50/70 dark:hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-bold shrink-0">
                          {ft.firstName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-xs md:text-sm">
                            {ft.firstName} {ft.lastName}
                          </p>
                          <p className="text-[11px] text-gray-400">{ft.address || 'Awka, Nigeria'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                      <p className="font-mono text-xs">{ft.phone}</p>
                      <p className="text-[11px] text-gray-400">{ft.email}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs hidden md:table-cell whitespace-nowrap">
                      {new Date(ft.visitDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={followUpVariant[ft.followUpStatus] || 'default'}>
                        {ft.followUpStatus}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {ft.followUpStatus !== 'COMPLETED' ? (
                        <button
                          type="button"
                          onClick={() => updateFollowUp(ft.id, ft.followUpStatus === 'PENDING' ? 'CONTACTED' : 'COMPLETED')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{ft.followUpStatus === 'PENDING' ? 'Mark Contacted' : 'Mark Completed'}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400 font-medium">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Register Visitor Modal ──────────────────────────────────────── */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Register First-Time Visitor"
      >
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
              placeholder="e.g. Joy"
            />
            <FormField
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
              placeholder="e.g. Adeyemi"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Phone Number"
              name="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
              placeholder="+234-800-000-0000"
            />
            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="guest@example.com"
            />
          </div>

          <FormField
            label="Residential / Office Address"
            name="address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Awka, Anambra State"
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2.5 rounded-full text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-xs px-6 py-2.5"
            >
              {loading ? 'Saving...' : 'Register Visitor'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FirstTimersPage;
