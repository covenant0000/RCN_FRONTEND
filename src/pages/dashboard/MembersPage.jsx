import { useState, useEffect, useRef } from 'react';
import {
  Search, Plus, Eye, Edit, Users, UserCheck, UserX, Clock,
  Trash2, CheckCircle2, AlertCircle, X, Save,
} from 'lucide-react';
import {
  Badge, Pagination, LoadingScreen, EmptyState, Modal,
  FormField, SelectField,
} from '../../components/ui';
import { mockMembers, mockDepartments, paginateMock } from '../../services/mock/mockData';
import { useAuth } from '../../context/AuthContext';

const statusVariant = {
  ACTIVE: 'success', INACTIVE: 'default', VISITOR: 'warning', TRANSFERRED: 'primary',
};

const EMPTY_FORM = {
  firstName: '', lastName: '', phone: '', email: '', gender: 'MALE',
  departmentId: '', status: 'ACTIVE',
};

/* ── Toast notification ── */
const Toast = ({ message, type, onDismiss }) => (
  <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium animate-fade-in ${
    type === 'success'
      ? 'bg-emerald-600 text-white'
      : 'bg-red-600 text-white'
  }`}>
    {type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
    {message}
    <button onClick={onDismiss} className="ml-2 opacity-70 hover:opacity-100"><X className="w-4 h-4" /></button>
  </div>
);

const MembersPage = () => {
  const { hasRole } = useAuth();
  const [search, setSearch]             = useState('');
  const [status, setStatus]             = useState('All');
  const [page, setPage]                 = useState(1);
  const [loading, setLoading]           = useState(false);
  const [membersList, setMembersList]   = useState(mockMembers);
  const [result, setResult]             = useState({ data: [], pagination: null });
  const [saving, setSaving]             = useState(false);

  // modals
  const [addModalOpen, setAddModalOpen]       = useState(false);
  const [editMember, setEditMember]           = useState(null);   // member object when editing
  const [viewMember, setViewMember]           = useState(null);
  const [deleteConfirm, setDeleteConfirm]     = useState(null);  // member id

  // form
  const [form, setForm] = useState(EMPTY_FORM);

  // toast
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (message, type = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  /* filtering */
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      let filtered = membersList;
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (m) =>
            m.profile?.firstName?.toLowerCase().includes(q) ||
            m.profile?.lastName?.toLowerCase().includes(q) ||
            m.memberNumber?.toLowerCase().includes(q)
        );
      }
      if (status !== 'All') filtered = filtered.filter((m) => m.status === status);
      setResult(paginateMock(filtered, page, 8));
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [search, status, page, membersList]);

  /* open add modal */
  const openAdd = () => { setForm(EMPTY_FORM); setEditMember(null); setAddModalOpen(true); };

  /* open edit modal */
  const openEdit = (member) => {
    setEditMember(member);
    setForm({
      firstName:    member.profile?.firstName    || '',
      lastName:     member.profile?.lastName     || '',
      phone:        member.profile?.phone        || '',
      email:        member.email                 || '',
      gender:       member.profile?.gender       || 'MALE',
      departmentId: member.department?.id        || '',
      status:       member.status                || 'ACTIVE',
    });
    setAddModalOpen(true);
  };

  /* submit (add or edit) */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));

    const dept = mockDepartments.find((d) => d.id === form.departmentId) || null;

    if (editMember) {
      setMembersList((prev) =>
        prev.map((m) =>
          m.id === editMember.id
            ? {
                ...m,
                status: form.status,
                department: dept,
                profile: { ...m.profile, firstName: form.firstName, lastName: form.lastName, phone: form.phone, gender: form.gender },
              }
            : m
        )
      );
      showToast('Member record updated successfully.');
    } else {
      const created = {
        id: `mem-${Date.now()}`,
        memberNumber: `RCN${String(membersList.length + 1).padStart(4, '0')}`,
        status: form.status,
        joinedDate: new Date().toISOString(),
        email: form.email,
        profile: { firstName: form.firstName, lastName: form.lastName, phone: form.phone, gender: form.gender, avatarUrl: null },
        department: dept,
      };
      setMembersList((prev) => [created, ...prev]);
      showToast('New member added to directory.');
    }
    setSaving(false);
    setAddModalOpen(false);
    setEditMember(null);
  };

  /* delete */
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    setMembersList((prev) => prev.filter((m) => m.id !== deleteConfirm));
    setSaving(false);
    setDeleteConfirm(null);
    showToast('Member record removed.', 'success');
  };

  const activeCount   = membersList.filter((m) => m.status === 'ACTIVE').length;
  const inactiveCount = membersList.filter((m) => m.status === 'INACTIVE').length;
  const visitorCount  = membersList.filter((m) => m.status === 'VISITOR').length;

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-white/10">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Church Membership Directory</h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage member enrollment, covenant status and ministry departments.</p>
        </div>
        {hasRole('ADMIN') && (
          <button type="button" onClick={openAdd} className="btn-primary text-xs px-5 py-2.5 shrink-0 self-start sm:self-auto" id="add-member">
            <Plus className="w-4 h-4" /> Add New Member
          </button>
        )}
      </div>

      {/* metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { icon: Users,     label: 'Total Enrolled',           value: membersList.length, color: 'text-primary dark:text-accent' },
          { icon: UserCheck, label: 'Active Members',           value: activeCount,        color: 'text-emerald-600 dark:text-emerald-400' },
          { icon: Clock,     label: 'First-Timers & Visitors',  value: visitorCount,       color: 'text-amber-600 dark:text-amber-400' },
          { icon: UserX,     label: 'Inactive Records',         value: inactiveCount,      color: 'text-gray-600 dark:text-gray-300' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
              <Icon className={`w-4 h-4 ${color}`} /> <span>{label}</span>
            </div>
            <p className={`text-xl md:text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text" placeholder="Search by member name or member ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-base pl-10" id="member-search"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'ACTIVE', 'VISITOR', 'INACTIVE'].map((s) => (
            <button
              key={s} type="button"
              onClick={() => { setStatus(s); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                status === s ? 'bg-accent text-white shadow-sm'
                  : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-accent'
              }`}
            >
              {s === 'All' ? 'All Records' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* table */}
      {loading ? (
        <LoadingScreen message="Loading directory..." />
      ) : result.data.length === 0 ? (
        <EmptyState icon={Users} title="No member records match your query" message="Try resetting your search keyword or changing status filters." />
      ) : (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm text-left">
                <thead className="border-b border-gray-100 dark:border-white/10 bg-gray-50/70 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3.5">Member Name</th>
                    <th className="px-5 py-3.5 hidden sm:table-cell">Member ID</th>
                    <th className="px-5 py-3.5 hidden md:table-cell">Department</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {result.data.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50/70 dark:hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-accent-gradient flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                            {member.profile?.firstName?.[0] || 'M'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{member.profile?.firstName} {member.profile?.lastName}</p>
                            <p className="text-[11px] text-gray-400">{member.profile?.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span className="font-mono text-xs bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">{member.memberNumber}</span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-600 dark:text-gray-300 hidden md:table-cell">{member.department?.name || '—'}</td>
                      <td className="px-5 py-4">
                        <Badge variant={statusVariant[member.status] || 'default'}>{member.status.charAt(0) + member.status.slice(1).toLowerCase()}</Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button type="button" onClick={() => setViewMember(member)}
                            className="p-2 rounded-lg text-gray-400 hover:text-accent hover:bg-accent/10 transition-colors" title="View profile">
                            <Eye className="w-4 h-4" />
                          </button>
                          {hasRole('ADMIN') && (
                            <>
                              <button type="button" onClick={() => openEdit(member)}
                                className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="Edit member">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button type="button" onClick={() => setDeleteConfirm(member.id)}
                                className="p-2 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors" title="Delete member">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination pagination={result.pagination} onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        </div>
      )}

      {/* ── Add / Edit Member Modal ── */}
      <Modal isOpen={addModalOpen} onClose={() => { setAddModalOpen(false); setEditMember(null); }} title={editMember ? 'Edit Member Record' : 'Add New Member to Registry'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="First Name" name="firstName" value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })} required placeholder="e.g. Samuel" />
            <FormField label="Last Name" name="lastName" value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })} required placeholder="e.g. Eze" />
          </div>
          <FormField label="Phone Number" name="phone" type="tel" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+234-800-000-0000" />
          <FormField label="Email Address" name="email" type="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="member@example.com" />
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Gender" name="gender" value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </SelectField>
            <SelectField label="Department" name="departmentId" value={form.departmentId}
              onChange={(e) => setForm({ ...form, departmentId: e.target.value })}>
              <option value="">Select Department</option>
              {mockDepartments.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
            </SelectField>
          </div>
          <SelectField label="Membership Status" name="status" value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="ACTIVE">Active Member</option>
            <option value="VISITOR">First-Timer / Visitor</option>
            <option value="INACTIVE">Inactive</option>
          </SelectField>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
            <button type="button" onClick={() => { setAddModalOpen(false); setEditMember(null); }}
              className="px-4 py-2.5 rounded-full text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary text-xs px-6 py-2.5 disabled:opacity-50">
              {saving ? 'Saving...' : editMember ? <><Save className="w-3.5 h-3.5" /> Update Member</> : 'Save Member'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── View Member Modal ── */}
      {viewMember && (
        <Modal isOpen={Boolean(viewMember)} onClose={() => setViewMember(null)} title="Member Card">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5">
              <div className="w-14 h-14 rounded-2xl bg-accent-gradient flex items-center justify-center text-white text-xl font-bold shrink-0">
                {viewMember.profile?.firstName?.[0]}
              </div>
              <div>
                <p className="font-display font-bold text-lg text-gray-900 dark:text-white">{viewMember.profile?.firstName} {viewMember.profile?.lastName}</p>
                <p className="text-xs text-accent font-mono font-semibold">{viewMember.memberNumber}</p>
                <p className="text-xs text-gray-400">{viewMember.profile?.phone}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { label: 'Department', value: viewMember.department?.name || 'Unassigned' },
                { label: 'Status',     value: viewMember.status },
                { label: 'Gender',     value: viewMember.profile?.gender || 'N/A' },
                { label: 'Enrolled',   value: new Date(viewMember.joinedDate).toLocaleDateString() },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                  <span className="text-gray-400">{label}</span>
                  <p className="font-semibold text-gray-900 dark:text-white mt-0.5">{value}</p>
                </div>
              ))}
            </div>
            <div className="pt-4 flex justify-end gap-3">
              {hasRole('ADMIN') && (
                <button type="button" onClick={() => { setViewMember(null); openEdit(viewMember); }}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
              )}
              <button type="button" onClick={() => setViewMember(null)} className="btn-primary text-xs px-5 py-2">Done</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Delete Confirm Modal ── */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Member Record" size="sm">
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-7 h-7 text-red-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">Are you sure you want to delete this member record? This action cannot be undone.</p>
          <div className="flex gap-3">
            <button type="button" onClick={() => setDeleteConfirm(null)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button type="button" onClick={handleDelete} disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors disabled:opacity-50">
              {saving ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>

      {/* toast */}
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
    </div>
  );
};

export default MembersPage;
