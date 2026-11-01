import { useState } from 'react';
import {
  Plus, Calendar, Users, Trash2, Pencil, ClipboardList,
  CheckCircle2, Clock, ChevronRight,
} from 'lucide-react';
import { Badge, EmptyState, Modal } from '../../components/ui';
import { mockRosters, mockDepartments, mockUsers } from '../../services/mock/mockData';

/* ── helpers ─────────────────────────────────────────────────────────────── */
const workerOptions = mockUsers.filter((u) =>
  ['WORKER', 'DEPARTMENT_HEAD', 'ADMIN', 'PASTOR'].includes(u.role)
);

const EMPTY_FORM = { serviceDate: '', departmentId: '', workerIds: [], notes: '' };

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

const isFuture = (iso) => new Date(iso) >= new Date();

/* ── summary metric card ─────────────────────────────────────────────────── */
const MetricCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-5 flex items-center gap-4">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-primary dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
    </div>
  </div>
);

/* ── main component ───────────────────────────────────────────────────────── */
const RostersPage = () => {
  const [rosters, setRosters] = useState(mockRosters);
  const [showModal, setShowModal] = useState(false);
  const [editRoster, setEditRoster] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  const total = rosters.length;
  const upcoming = rosters.filter((r) => isFuture(r.serviceDate)).length;
  const deptsCovered = new Set(rosters.map((r) => r.department?.id)).size;
  const totalWorkers = rosters.reduce((acc, r) => acc + (r.workers?.length || 0), 0);

  const openCreate = () => { setEditRoster(null); setForm(EMPTY_FORM); setShowModal(true); };

  const openEdit = (roster) => {
    setEditRoster(roster);
    setForm({
      serviceDate: roster.serviceDate?.slice(0, 10) || '',
      departmentId: roster.department?.id || '',
      workerIds: roster.workers?.map((w) => w.id) || [],
      notes: roster.notes || '',
    });
    setShowModal(true);
  };

  const toggleWorker = (id) =>
    setForm((f) => ({
      ...f,
      workerIds: f.workerIds.includes(id)
        ? f.workerIds.filter((w) => w !== id)
        : [...f.workerIds, id],
    }));

  const handleSave = async () => {
    if (!form.serviceDate || !form.departmentId) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    const dept = mockDepartments.find((d) => d.id === form.departmentId);
    const workers = workerOptions.filter((u) => form.workerIds.includes(u.id));
    if (editRoster) {
      setRosters((prev) =>
        prev.map((r) =>
          r.id === editRoster.id
            ? { ...r, serviceDate: form.serviceDate, department: dept, workers, notes: form.notes }
            : r
        )
      );
    } else {
      setRosters((prev) => [
        { id: `roster-${Date.now()}`, serviceDate: form.serviceDate, department: dept, workers, notes: form.notes },
        ...prev,
      ]);
    }
    setSaving(false);
    setShowModal(false);
  };

  const handleDelete = (id) => { setRosters((prev) => prev.filter((r) => r.id !== id)); setDeleteId(null); };

  return (
    <div>
      {/* header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary dark:text-white mb-1">Service Duty Rosters</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Organise and assign workers to service duties and events</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm" id="create-roster">
          <Plus className="w-4 h-4" /> Create Roster
        </button>
      </div>

      {/* metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard icon={ClipboardList} label="Total Rosters" value={total} color="bg-[#1D1747]" />
        <MetricCard icon={Clock} label="Upcoming" value={upcoming} color="bg-accent" />
        <MetricCard icon={Users} label="Depts Covered" value={deptsCovered} color="bg-[#d4a84b]" />
        <MetricCard icon={CheckCircle2} label="Workers Assigned" value={totalWorkers} color="bg-emerald-500" />
      </div>

      {/* roster grid */}
      {rosters.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No rosters found"
          message="Create a service roster to assign workers to church duties."
          action={<button onClick={openCreate} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Create Roster</button>}
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {rosters.map((roster) => {
            const future = isFuture(roster.serviceDate);
            return (
              <div key={roster.id} className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4 gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-primary dark:text-white truncate">{roster.department?.name || 'Unknown Department'}</h3>
                      {future ? <Badge variant="accent" className="text-xs">Upcoming</Badge> : <Badge variant="gray" className="text-xs">Past</Badge>}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{fmtDate(roster.serviceDate)}</span>
                    </div>
                  </div>
                  <span className="flex-shrink-0 bg-accent/10 text-accent text-xs font-semibold px-2.5 py-1 rounded-full">
                    {roster.workers?.length || 0} workers
                  </span>
                </div>

                {roster.notes && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 bg-gray-50 dark:bg-white/5 rounded-xl px-3 py-2 leading-relaxed">{roster.notes}</p>
                )}

                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Assigned Workers</p>
                  <div className="flex flex-wrap gap-2">
                    {(roster.workers || []).map((w) => (
                      <div key={w.id} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 dark:bg-white/5 rounded-full border border-gray-100 dark:border-white/10 text-xs text-gray-700 dark:text-gray-300">
                        <div className="w-5 h-5 rounded-full bg-accent-gradient flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0">
                          {w.profile?.firstName?.[0] || '?'}
                        </div>
                        {w.profile?.firstName} {w.profile?.lastName}
                      </div>
                    ))}
                    {(!roster.workers || roster.workers.length === 0) && (
                      <span className="text-xs text-gray-400 italic">No workers assigned yet</span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex items-center gap-3">
                  <button onClick={() => openEdit(roster)} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-accent transition-colors font-medium">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <span className="text-gray-200 dark:text-white/10">|</span>
                  <button onClick={() => setDeleteId(roster.id)} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                  <span className="ml-auto text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    Details <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editRoster ? 'Edit Roster' : 'Create Service Roster'} size="lg">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Service Date <span className="text-red-500">*</span></label>
            <input type="date" value={form.serviceDate} onChange={(e) => setForm((f) => ({ ...f, serviceDate: e.target.value }))} className="input-base dark:bg-[#1a1830] dark:border-white/10 dark:text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Department <span className="text-red-500">*</span></label>
            <select value={form.departmentId} onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value }))} className="input-base dark:bg-[#1a1830] dark:border-white/10 dark:text-white">
              <option value="">Select department</option>
              {mockDepartments.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Assign Workers</label>
            <div className="max-h-48 overflow-y-auto rounded-xl border border-gray-200 dark:border-white/10 divide-y divide-gray-100 dark:divide-white/10">
              {workerOptions.map((w) => {
                const checked = form.workerIds.includes(w.id);
                return (
                  <label key={w.id} className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${checked ? 'bg-accent/5 dark:bg-accent/10' : ''}`}>
                    <input type="checkbox" checked={checked} onChange={() => toggleWorker(w.id)} className="rounded text-accent focus:ring-accent" />
                    <div className="w-7 h-7 rounded-full bg-accent-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {w.profile?.firstName?.[0] || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{w.profile?.firstName} {w.profile?.lastName}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">{w.role.toLowerCase().replace('_', ' ')}</p>
                    </div>
                    {checked && <CheckCircle2 className="w-4 h-4 text-accent ml-auto flex-shrink-0" />}
                  </label>
                );
              })}
            </div>
            {form.workerIds.length > 0 && (
              <p className="text-xs text-accent mt-1.5 font-medium">{form.workerIds.length} worker{form.workerIds.length > 1 ? 's' : ''} selected</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Notes <span className="text-gray-400 text-xs">(optional)</span></label>
            <textarea rows={3} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Special instructions, service theme..." className="input-base resize-none dark:bg-[#1a1830] dark:border-white/10 dark:text-white" />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving || !form.serviceDate || !form.departmentId} className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {saving ? 'Saving...' : editRoster ? 'Update Roster' : 'Create Roster'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Roster" size="sm">
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-7 h-7 text-red-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">Are you sure you want to delete this roster? This action cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
            <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RostersPage;
