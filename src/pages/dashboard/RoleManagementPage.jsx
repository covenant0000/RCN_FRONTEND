import { useState, useRef } from 'react';
import {
  Shield, Search, Users, CheckCircle2, AlertCircle, X,
  AlertTriangle, Edit, UserCheck, UserX, ChevronDown,
} from 'lucide-react';
import { Badge, Modal, LoadingScreen } from '../../components/ui';
import { mockUsers } from '../../services/mock/mockData';
import { useAuth } from '../../context/AuthContext';
import { ROLE_HIERARCHY } from '../../constants';

/* ── role metadata ── */
const ROLE_META = {
  SUPER_ADMIN:     { label: 'Super Admin',     color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', badge: 'primary' },
  ADMIN:           { label: 'Admin',           color: 'bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-300',   badge: 'primary' },
  PASTOR:          { label: 'Pastor',          color: 'bg-amber-100  text-amber-700  dark:bg-amber-900/30  dark:text-amber-300',  badge: 'gold'    },
  DEPARTMENT_HEAD: { label: 'Department Head', color: 'bg-teal-100   text-teal-700   dark:bg-teal-900/30   dark:text-teal-300',   badge: 'accent'  },
  WORKER:          { label: 'Worker',          color: 'bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-300',  badge: 'success' },
  MEMBER:          { label: 'Member',          color: 'bg-gray-100   text-gray-700   dark:bg-gray-700/40   dark:text-gray-300',   badge: 'default' },
};

const ASSIGNABLE_ROLES = ['MEMBER', 'WORKER', 'DEPARTMENT_HEAD', 'PASTOR', 'ADMIN', 'SUPER_ADMIN'];

const Toast = ({ message, type, onDismiss }) => (
  <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium animate-fade-in ${type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
    {type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
    {message}
    <button onClick={onDismiss} className="ml-2 opacity-70 hover:opacity-100"><X className="w-4 h-4" /></button>
  </div>
);

const RoleManagementPage = () => {
  const { user: currentUser, hasRole } = useAuth();

  // Guard — only Super Admin
  if (!hasRole('SUPER_ADMIN')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4 p-8">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <Shield className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
          Role management is restricted to Super Administrators only.
        </p>
      </div>
    );
  }

  const [users, setUsers]             = useState(mockUsers);
  const [search, setSearch]           = useState('');
  const [roleFilter, setRoleFilter]   = useState('ALL');
  const [editUser, setEditUser]       = useState(null);
  const [pendingRole, setPendingRole] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving]           = useState(false);
  const [toast, setToast]             = useState(null);
  const toastTimer = useRef(null);

  const showToast = (message, type = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  /* ── filter ── */
  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const nameMatch =
      u.profile?.firstName?.toLowerCase().includes(q) ||
      u.profile?.lastName?.toLowerCase().includes(q)  ||
      u.email?.toLowerCase().includes(q);
    const roleMatch = roleFilter === 'ALL' || u.role === roleFilter;
    return nameMatch && roleMatch;
  });

  /* ── open role-change dialog ── */
  const openRoleDialog = (u) => {
    // Cannot modify your own role or promote above yourself
    if (u.id === currentUser?.id) {
      showToast('You cannot change your own role.', 'error');
      return;
    }
    setEditUser(u);
    setPendingRole(u.role);
    setConfirmOpen(false);
  };

  /* ── confirm change ── */
  const requestConfirm = () => {
    if (pendingRole === editUser?.role) { setEditUser(null); return; }
    setConfirmOpen(true);
  };

  const applyRoleChange = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600)); // mock delay
    setUsers((prev) =>
      prev.map((u) => u.id === editUser.id ? { ...u, role: pendingRole } : u)
    );
    showToast(`Role updated to ${ROLE_META[pendingRole]?.label || pendingRole} for ${editUser.profile?.firstName} ${editUser.profile?.lastName}.`);
    setSaving(false);
    setConfirmOpen(false);
    setEditUser(null);
  };

  /* ── toggle active status ── */
  const toggleActive = async (userId) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    setUsers((prev) =>
      prev.map((u) => u.id === userId ? { ...u, isActive: !u.isActive } : u)
    );
    setSaving(false);
    showToast('User status updated.');
  };

  /* ── role distribution ── */
  const roleCount = ASSIGNABLE_ROLES.reduce((acc, r) => {
    acc[r] = users.filter((u) => u.role === r).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-white/10">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Role & Permission Management</h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Assign and manage user roles across the platform. Super Admin access only.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold">
          <Shield className="w-4 h-4" /> Super Admin Panel
        </div>
      </div>

      {/* role distribution cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {ASSIGNABLE_ROLES.map((role) => {
          const meta = ROLE_META[role];
          return (
            <button
              key={role}
              type="button"
              onClick={() => setRoleFilter(roleFilter === role ? 'ALL' : role)}
              className={`p-3 rounded-2xl border text-center transition-all ${
                roleFilter === role
                  ? 'border-accent bg-accent/10 shadow-sm'
                  : 'bg-white dark:bg-[#12101e] border-gray-100 dark:border-white/10 hover:border-accent/40'
              }`}
            >
              <p className="text-xl font-bold text-primary dark:text-white">{roleCount[role] || 0}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">{meta.label}</p>
            </button>
          );
        })}
      </div>

      {/* search + role filter row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base pl-10"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', ...ASSIGNABLE_ROLES].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                roleFilter === r
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-accent'
              }`}
            >
              {r === 'ALL' ? 'All Users' : ROLE_META[r]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* users table */}
      <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm text-left">
            <thead className="border-b border-gray-100 dark:border-white/10 bg-gray-50/70 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Email</th>
                <th className="px-5 py-3.5">Current Role</th>
                <th className="px-5 py-3.5 hidden md:table-cell">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-400 dark:text-gray-500 text-sm">
                    No users match your search or filter.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const meta     = ROLE_META[u.role] || ROLE_META.MEMBER;
                  const isSelf   = u.id === currentUser?.id;
                  const initials = `${u.profile?.firstName?.[0] || ''}${u.profile?.lastName?.[0] || ''}` || u.email?.[0]?.toUpperCase();

                  return (
                    <tr key={u.id} className={`hover:bg-gray-50/70 dark:hover:bg-white/5 transition-colors ${isSelf ? 'bg-accent/5 dark:bg-accent/10' : ''}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-accent-gradient flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">
                              {u.profile?.firstName} {u.profile?.lastName}
                              {isSelf && <span className="ml-1.5 text-[10px] text-accent font-bold">(You)</span>}
                            </p>
                            <p className="text-[11px] text-gray-400">{u.profile?.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-600 dark:text-gray-300 text-xs">{u.email}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${meta.color}`}>
                          <Shield className="w-3 h-3" /> {meta.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <Badge variant={u.isActive ? 'success' : 'default'}>{u.isActive ? 'Active' : 'Inactive'}</Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Activate / Deactivate */}
                          {!isSelf && (
                            <button
                              type="button"
                              onClick={() => toggleActive(u.id)}
                              disabled={saving}
                              className={`p-1.5 rounded-lg transition-colors ${
                                u.isActive
                                  ? 'text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20'
                                  : 'text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
                              }`}
                              title={u.isActive ? 'Deactivate user' : 'Activate user'}
                            >
                              {u.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            </button>
                          )}
                          {/* Change role */}
                          {!isSelf && (
                            <button
                              type="button"
                              onClick={() => openRoleDialog(u)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-accent hover:bg-accent/10 transition-colors"
                              title="Change role"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* summary footer */}
      <p className="text-xs text-gray-400 dark:text-gray-500 text-right">
        Showing {filtered.length} of {users.length} registered users
      </p>

      {/* ── Role Edit Modal ── */}
      {editUser && !confirmOpen && (
        <Modal isOpen={true} onClose={() => setEditUser(null)} title="Change User Role" size="md">
          <div className="space-y-5">
            {/* user info */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5">
              <div className="w-12 h-12 rounded-xl bg-accent-gradient flex items-center justify-center text-white font-bold shrink-0">
                {`${editUser.profile?.firstName?.[0] || ''}${editUser.profile?.lastName?.[0] || ''}`}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{editUser.profile?.firstName} {editUser.profile?.lastName}</p>
                <p className="text-xs text-gray-400">{editUser.email}</p>
              </div>
            </div>

            {/* current role */}
            <div>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Current Role</p>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${ROLE_META[editUser.role]?.color}`}>
                <Shield className="w-3.5 h-3.5" /> {ROLE_META[editUser.role]?.label}
              </span>
            </div>

            {/* new role selector */}
            <div>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Assign New Role</p>
              <div className="grid grid-cols-2 gap-2">
                {ASSIGNABLE_ROLES.map((r) => {
                  const meta     = ROLE_META[r];
                  const selected = pendingRole === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setPendingRole(r)}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-left transition-all ${
                        selected
                          ? 'border-accent bg-accent/10 shadow-sm'
                          : 'border-gray-200 dark:border-white/10 hover:border-accent/40 bg-white dark:bg-[#1a1830]'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${meta.color}`}>
                        <Shield className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <p className={`text-xs font-semibold ${selected ? 'text-accent' : 'text-gray-800 dark:text-gray-200'}`}>{meta.label}</p>
                      </div>
                      {selected && <CheckCircle2 className="w-4 h-4 text-accent ml-auto flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* warning for elevated roles */}
            {['SUPER_ADMIN', 'ADMIN', 'PASTOR'].includes(pendingRole) && pendingRole !== editUser.role && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 text-xs text-amber-700 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>You are assigning an elevated role. This user will gain significant platform privileges. Please confirm carefully.</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setEditUser(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <button type="button" onClick={requestConfirm} disabled={pendingRole === editUser.role}
                className="flex-1 btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                {pendingRole === editUser.role ? 'No Changes' : 'Apply Role Change'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Confirm Role Change ── */}
      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm Role Change" size="sm">
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7 text-amber-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
            Change <strong className="text-gray-900 dark:text-white">{editUser?.profile?.firstName} {editUser?.profile?.lastName}</strong>'s role from{' '}
            <strong className="text-gray-900 dark:text-white">{ROLE_META[editUser?.role]?.label}</strong> to{' '}
            <strong className="text-accent">{ROLE_META[pendingRole]?.label}</strong>?
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">This will take effect immediately and update their access permissions.</p>
          <div className="flex gap-3">
            <button type="button" onClick={() => setConfirmOpen(false)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button type="button" onClick={applyRoleChange} disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-white text-sm font-medium transition-colors disabled:opacity-50">
              {saving ? 'Applying...' : 'Confirm Change'}
            </button>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
    </div>
  );
};

export default RoleManagementPage;

