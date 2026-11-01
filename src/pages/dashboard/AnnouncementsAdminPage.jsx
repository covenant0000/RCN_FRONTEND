import { useState, useRef } from 'react';
import {
  Plus, Edit, Trash2, Bell, CheckCircle2, AlertCircle, X, Save, Users,
} from 'lucide-react';
import { Badge, EmptyState, Modal, FormField, TextareaField, SelectField } from '../../components/ui';
import { mockAnnouncements, mockDepartments } from '../../services/mock/mockData';
import { useAuth } from '../../context/AuthContext';

const priorityVariant = { HIGH: 'danger', MEDIUM: 'warning', LOW: 'accent' };

/* ── Audience options ── */
const AUDIENCE_OPTIONS = [
  { value: 'ALL',              label: '🌍 Everyone / Entire Church' },
  { value: 'MEMBERS',         label: '👥 Church Members' },
  { value: 'WORKERS',         label: '🔧 Workers & Volunteers' },
  { value: 'DEPARTMENT_HEADS',label: '👔 Department Leaders' },
  { value: 'PASTORS',         label: '✝️ Pastors' },
  { value: 'ADMINS',          label: '🛡️ Administrators' },
  { value: 'YOUTH',           label: '⚡ Youth / Eaglets' },
  { value: 'CHILDREN',        label: '🌟 Children Ministry' },
  { value: 'WOMEN',           label: '🌸 Women / Lioness' },
  { value: 'MEDIA',           label: '🎥 Media Team' },
  { value: 'DEPARTMENT',      label: '🏛️ Specific Department...' },
];

const Toast = ({ message, type, onDismiss }) => (
  <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium animate-fade-in ${type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
    {type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
    {message}
    <button onClick={onDismiss} className="ml-2 opacity-70 hover:opacity-100"><X className="w-4 h-4" /></button>
  </div>
);

const EMPTY_FORM = {
  title: '', content: '', priority: 'MEDIUM', category: 'GENERAL',
  audience: 'ALL', departmentId: '',
};

const audienceLabel = (ann) => {
  if (!ann.audience || ann.audience === 'ALL') return 'Everyone';
  if (ann.audience === 'DEPARTMENT' && ann.departmentId) {
    const dept = mockDepartments.find((d) => d.id === ann.departmentId);
    return dept ? dept.name : 'Specific Dept.';
  }
  const opt = AUDIENCE_OPTIONS.find((o) => o.value === ann.audience);
  return opt ? opt.label.replace(/^.{2}\s/, '') : ann.audience;
};

const AnnouncementsAdminPage = () => {
  const { hasRole } = useAuth();
  const [items, setItems]               = useState(mockAnnouncements);
  const [showModal, setShowModal]       = useState(false);
  const [editItem, setEditItem]         = useState(null);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saving, setSaving]             = useState(false);
  const [toast, setToast]               = useState(null);
  const toastTimer = useRef(null);

  const showToast = (message, type = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  const openCreate = () => { setEditItem(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit   = (ann) => {
    setEditItem(ann);
    setForm({
      title:        ann.title        || '',
      content:      ann.content      || '',
      priority:     ann.priority     || 'MEDIUM',
      category:     ann.category     || 'GENERAL',
      audience:     ann.audience     || 'ALL',
      departmentId: ann.departmentId || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));

    if (editItem) {
      setItems((prev) =>
        prev.map((a) => a.id === editItem.id ? { ...a, ...form } : a)
      );
      showToast('Announcement updated.');
    } else {
      setItems((prev) => [
        { id: `ann-${Date.now()}`, ...form, publishedAt: new Date().toISOString() },
        ...prev,
      ]);
      showToast('Announcement published to congregation.');
    }
    setSaving(false);
    setShowModal(false);
  };

  const handleDelete = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    setItems((prev) => prev.filter((a) => a.id !== deleteConfirm));
    setSaving(false);
    setDeleteConfirm(null);
    showToast('Announcement removed.');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-white/10">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Church Announcements & Bulletins</h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5">Broadcast service directives, event notifications and congregation memos.</p>
        </div>
        {hasRole('ADMIN') && (
          <button type="button" onClick={openCreate} className="btn-primary text-xs px-5 py-2.5 shrink-0 self-start sm:self-auto" id="create-announcement">
            <Plus className="w-4 h-4" /> New Announcement
          </button>
        )}
      </div>

      {/* summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-primary dark:text-white">{items.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Total</p>
        </div>
        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{items.filter((a) => a.priority === 'HIGH').length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">High Priority</p>
        </div>
        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-accent">{items.filter((a) => !a.audience || a.audience === 'ALL').length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Church-Wide</p>
        </div>
      </div>

      {/* feed */}
      {items.length === 0 ? (
        <EmptyState icon={Bell} title="No announcements published" message="Publish an announcement to notify the community." />
      ) : (
        <div className="space-y-4">
          {items.map((ann) => (
            <div key={ann.id}
              className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-6 hover:border-accent/40 dark:hover:border-accent/40 transition-all duration-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant={priorityVariant[ann.priority] || 'accent'}>{ann.priority}</Badge>
                    {ann.category && (
                      <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/10 px-2.5 py-0.5 rounded-full">{ann.category}</span>
                    )}
                    {/* audience badge */}
                    <span className="inline-flex items-center gap-1 text-[11px] text-accent bg-accent/10 px-2.5 py-0.5 rounded-full font-medium">
                      <Users className="w-3 h-3" /> {audienceLabel(ann)}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">
                      {new Date(ann.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-base md:text-lg mb-1.5">{ann.title}</h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{ann.content}</p>
                </div>

                {hasRole('ADMIN') && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button type="button" onClick={() => openEdit(ann)}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors" title="Edit announcement">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => setDeleteConfirm(ann.id)}
                      className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors" title="Delete announcement">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditItem(null); }} title={editItem ? 'Edit Announcement' : 'Broadcast Church Announcement'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Announcement Title" name="title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} required
            placeholder="e.g. Wednesday Mid-Week Service Notice" />

          <TextareaField label="Full Content Body" name="content" value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })} required
            placeholder="Details of the announcement..." rows={4} />

          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Priority Level" name="priority" value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option value="HIGH">High Priority (Urgent)</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority (General)</option>
            </SelectField>

            <FormField label="Category / Tag" name="category" value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g. PRAYER, SERVICE" />
          </div>

          {/* ── Audience selector ── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Target Audience <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto rounded-xl border border-gray-200 dark:border-white/10 p-3">
              {AUDIENCE_OPTIONS.map((opt) => {
                const selected = form.audience === opt.value;
                return (
                  <button key={opt.value} type="button"
                    onClick={() => setForm({ ...form, audience: opt.value, departmentId: opt.value !== 'DEPARTMENT' ? '' : form.departmentId })}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                      selected
                        ? 'bg-accent text-white border-accent shadow-sm'
                        : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-accent'
                    }`}>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Department selector — visible only when audience = DEPARTMENT */}
          {form.audience === 'DEPARTMENT' && (
            <SelectField label="Select Department" name="departmentId" value={form.departmentId}
              onChange={(e) => setForm({ ...form, departmentId: e.target.value })} required>
              <option value="">Choose a department...</option>
              {mockDepartments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </SelectField>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
            <button type="button" onClick={() => { setShowModal(false); setEditItem(null); }}
              className="px-4 py-2.5 rounded-full text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary text-xs px-6 py-2.5 disabled:opacity-50">
              {saving ? 'Publishing...' : editItem ? <><Save className="w-3.5 h-3.5" /> Update Announcement</> : 'Broadcast Bulletin'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Delete Confirm ── */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Announcement" size="sm">
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-7 h-7 text-red-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">Are you sure you want to delete this announcement?</p>
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

export default AnnouncementsAdminPage;
