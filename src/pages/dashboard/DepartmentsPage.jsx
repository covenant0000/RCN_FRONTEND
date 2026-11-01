import { useState, useRef } from 'react';
import {
  Building2, Users, Plus, Edit, ArrowRight, Trash2,
  CheckCircle2, AlertCircle, X, Save, UserCircle,
} from 'lucide-react';
import { Badge, Modal, FormField, TextareaField, SelectField } from '../../components/ui';
import { mockDepartments, mockUsers } from '../../services/mock/mockData';
import { useAuth } from '../../context/AuthContext';

/* ── Toast ── */
const Toast = ({ message, type, onDismiss }) => (
  <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium animate-fade-in ${type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
    {type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
    {message}
    <button onClick={onDismiss} className="ml-2 opacity-70 hover:opacity-100"><X className="w-4 h-4" /></button>
  </div>
);

const leaderOptions = mockUsers.filter((u) =>
  ['DEPARTMENT_HEAD', 'PASTOR', 'ADMIN', 'SUPER_ADMIN'].includes(u.role)
);

const EMPTY_FORM = { name: '', description: '', leaderId: '' };

const DepartmentsPage = () => {
  const { hasRole } = useAuth();
  const [departments, setDepartments] = useState(mockDepartments);
  const [modalOpen, setModalOpen]     = useState(false);
  const [editDept, setEditDept]       = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [viewDept, setViewDept]       = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saving, setSaving]           = useState(false);
  const [toast, setToast]             = useState(null);
  const toastTimer = useRef(null);

  const showToast = (message, type = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  const openCreate = () => { setEditDept(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit   = (dept) => {
    setEditDept(dept);
    setForm({ name: dept.name || '', description: dept.description || '', leaderId: dept.leaderId || '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    const leader = leaderOptions.find((u) => u.id === form.leaderId) || null;

    if (editDept) {
      setDepartments((prev) =>
        prev.map((d) => d.id === editDept.id
          ? { ...d, name: form.name, description: form.description, leaderId: form.leaderId, leader }
          : d
        )
      );
      showToast('Department updated successfully.');
    } else {
      setDepartments((prev) => [
        ...prev,
        { id: `dep-${Date.now()}`, name: form.name, description: form.description, leaderId: form.leaderId, leader, isActive: true, memberCount: 0 },
      ]);
      showToast('Department created successfully.');
    }
    setSaving(false);
    setModalOpen(false);
  };

  const handleDelete = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    setDepartments((prev) => prev.filter((d) => d.id !== deleteConfirm));
    setSaving(false);
    setDeleteConfirm(null);
    showToast('Department removed.');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-white/10">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Ministries & Service Departments</h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5">Organize sanctuary service units, workforce deployment and ministry leaders.</p>
        </div>
        {hasRole('ADMIN') && (
          <button type="button" onClick={openCreate} className="btn-primary text-xs px-5 py-2.5 shrink-0 self-start sm:self-auto" id="add-department">
            <Plus className="w-4 h-4" /> Add New Department
          </button>
        )}
      </div>

      {/* metrics strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-primary dark:text-white">{departments.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Total Departments</p>
        </div>
        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{departments.filter((d) => d.isActive).length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Active</p>
        </div>
        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-accent">{departments.reduce((a, d) => a + (d.memberCount || 0), 0)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Total Workers</p>
        </div>
      </div>

      {/* grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept) => (
          <div key={dept.id}
            className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-6 hover:border-accent/40 dark:hover:border-accent/40 transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <Badge variant={dept.isActive ? 'success' : 'default'}>{dept.isActive ? 'Active' : 'Inactive'}</Badge>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-base group-hover:text-accent transition-colors mb-1.5">{dept.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-3">{dept.description}</p>
              {dept.leader && (
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <UserCircle className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                  <span>{dept.leader.profile?.firstName} {dept.leader.profile?.lastName}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 font-medium">
                <Users className="w-4 h-4 text-accent" /> {dept.memberCount || 0} Workers
              </span>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setViewDept(dept)}
                  className="text-accent font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity group-hover:translate-x-0.5 duration-200">
                  Details <ArrowRight className="w-3 h-3" />
                </button>
                {hasRole('ADMIN') && (
                  <>
                    <span className="text-gray-200 dark:text-white/10">|</span>
                    <button type="button" onClick={() => openEdit(dept)}
                      className="text-gray-400 hover:text-blue-500 transition-colors" title="Edit department">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => setDeleteConfirm(dept.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors" title="Delete department">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Create / Edit Modal ── */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editDept ? 'Edit Department' : 'Create New Ministry Department'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Department Name" name="name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Media & Broadcast Technology" />
          <TextareaField label="Description & Mandate" name="description" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} required
            placeholder="Outline the responsibilities and service schedule..." />
          <SelectField label="Department Leader (optional)" name="leaderId" value={form.leaderId}
            onChange={(e) => setForm({ ...form, leaderId: e.target.value })}>
            <option value="">No leader assigned</option>
            {leaderOptions.map((u) => (
              <option key={u.id} value={u.id}>{u.profile?.firstName} {u.profile?.lastName} — {u.role.replace('_', ' ')}</option>
            ))}
          </SelectField>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
            <button type="button" onClick={() => setModalOpen(false)}
              className="px-4 py-2.5 rounded-full text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary text-xs px-6 py-2.5 disabled:opacity-50">
              {saving ? 'Saving...' : editDept ? <><Save className="w-3.5 h-3.5" /> Update Department</> : 'Create Department'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── View Department Modal ── */}
      {viewDept && (
        <Modal isOpen={Boolean(viewDept)} onClose={() => setViewDept(null)} title="Department Details">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{viewDept.name}</h3>
                <Badge variant={viewDept.isActive ? 'success' : 'default'}>{viewDept.isActive ? 'Active' : 'Inactive'}</Badge>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{viewDept.description || 'No description provided.'}</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <span className="text-gray-400">Workers</span>
                <p className="font-semibold text-gray-900 dark:text-white mt-0.5">{viewDept.memberCount || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <span className="text-gray-400">Leader</span>
                <p className="font-semibold text-gray-900 dark:text-white mt-0.5">
                  {viewDept.leader ? `${viewDept.leader.profile?.firstName} ${viewDept.leader.profile?.lastName}` : 'Unassigned'}
                </p>
              </div>
            </div>
            <div className="pt-4 flex justify-end gap-3">
              {hasRole('ADMIN') && (
                <button type="button" onClick={() => { setViewDept(null); openEdit(viewDept); }}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
              )}
              <button type="button" onClick={() => setViewDept(null)} className="btn-primary text-xs px-5 py-2">Close</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Delete Confirm Modal ── */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Department" size="sm">
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-7 h-7 text-red-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">Are you sure? Deleting this department will remove it from all rosters and assignments.</p>
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

      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
    </div>
  );
};

export default DepartmentsPage;
