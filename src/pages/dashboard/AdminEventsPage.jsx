import { useState, useRef } from 'react';
import {
  Plus, Calendar, Edit, Trash2, Eye, MapPin, CheckCircle2, AlertCircle, X, Save,
} from 'lucide-react';
import { Badge, EmptyState, Modal, FormField, SelectField } from '../../components/ui';
import { mockEvents } from '../../services/mock/mockData';
import { useAuth } from '../../context/AuthContext';

const statusVariant = { PUBLISHED: 'success', DRAFT: 'warning', CANCELLED: 'danger', ARCHIVED: 'default' };

const EMPTY_FORM = {
  title: '', description: '', startDate: '', endDate: '', location: '', category: 'CONFERENCE', status: 'PUBLISHED',
};

const Toast = ({ message, type, onDismiss }) => (
  <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium animate-fade-in ${type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
    {type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
    {message}
    <button onClick={onDismiss} className="ml-2 opacity-70 hover:opacity-100"><X className="w-4 h-4" /></button>
  </div>
);

const AdminEventsPage = () => {
  const { hasRole } = useAuth();
  const [events, setEvents] = useState(mockEvents);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [modalOpen, setModalOpen]           = useState(false);
  const [editEvent, setEditEvent]           = useState(null);
  const [previewEvent, setPreviewEvent]     = useState(null);
  const [deleteConfirm, setDeleteConfirm]   = useState(null);
  const [form, setForm]                     = useState(EMPTY_FORM);
  const [saving, setSaving]                 = useState(false);
  const [toast, setToast]                   = useState(null);
  const toastTimer = useRef(null);

  const showToast = (message, type = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  const openCreate = () => { setEditEvent(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit   = (event) => {
    setEditEvent(event);
    setForm({
      title: event.title || '', description: event.description || '',
      startDate: event.startDate?.slice(0, 10) || '', endDate: event.endDate?.slice(0, 10) || '',
      location: event.location || '', category: event.category || 'CONFERENCE', status: event.status || 'PUBLISHED',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.startDate) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));

    if (editEvent) {
      setEvents((prev) => prev.map((ev) => ev.id === editEvent.id ? { ...ev, ...form } : ev));
      showToast('Event updated successfully.');
    } else {
      setEvents((prev) => [{ id: `evt-${Date.now()}`, ...form, imageUrl: '/conference-bg.jpg' }, ...prev]);
      showToast('Event published successfully.');
    }
    setSaving(false);
    setModalOpen(false);
  };

  const handleDelete = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    setEvents((prev) => prev.filter((e) => e.id !== deleteConfirm));
    setSaving(false);
    setDeleteConfirm(null);
    showToast('Event deleted.');
  };

  const filteredEvents = categoryFilter === 'All' ? events : events.filter((e) => e.category === categoryFilter);

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-white/10">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Events & Conferences Management</h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5">Coordinate apostolic gatherings, conventions and weekly service schedules.</p>
        </div>
        {hasRole('ADMIN') && (
          <button type="button" onClick={openCreate} className="btn-primary text-xs px-5 py-2.5 shrink-0 self-start sm:self-auto" id="create-event">
            <Plus className="w-4 h-4" /> Create New Event
          </button>
        )}
      </div>

      {/* filter tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {['All', 'CONFERENCE', 'WORSHIP', 'YOUTH', 'WOMEN', 'MINISTERS'].map((cat) => (
          <button key={cat} type="button" onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              categoryFilter === cat ? 'bg-accent text-white shadow-sm'
                : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-accent'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* table */}
      {filteredEvents.length === 0 ? (
        <EmptyState icon={Calendar} title="No events matching this filter" message="Schedule an event or reset your category filter." />
      ) : (
        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm text-left">
              <thead className="border-b border-gray-100 dark:border-white/10 bg-gray-50/70 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Event Details</th>
                  <th className="px-5 py-3.5 hidden sm:table-cell">Date & Time</th>
                  <th className="px-5 py-3.5 hidden md:table-cell">Category</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50/70 dark:hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-cover bg-center shrink-0 shadow-sm" style={{ backgroundImage: `url(${event.imageUrl})` }} />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white text-xs md:text-sm truncate">{event.title}</p>
                          <p className="text-[11px] text-gray-400 truncate flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-accent shrink-0" /> {event.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs hidden sm:table-cell whitespace-nowrap">
                      {new Date(event.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell"><Badge variant="accent">{event.category}</Badge></td>
                    <td className="px-5 py-4"><Badge variant={statusVariant[event.status] || 'default'}>{event.status}</Badge></td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => setPreviewEvent(event)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-accent hover:bg-accent/10 transition-colors" title="Preview details">
                          <Eye className="w-4 h-4" />
                        </button>
                        {hasRole('ADMIN') && (
                          <>
                            <button type="button" onClick={() => openEdit(event)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="Edit event">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button type="button" onClick={() => setDeleteConfirm(event.id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors" title="Delete event">
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
      )}

      {/* ── Create / Edit Modal ── */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editEvent ? 'Edit Event' : 'Publish Church Event / Conference'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Event Title" name="title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Kingdom Come Conference 2025" />
          <FormField label="Location / Venue" name="location" value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })} required placeholder="e.g. RCN International Centre, Awka" />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Date" name="startDate" type="date" value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
            <FormField label="End Date" name="endDate" type="date" value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Category" name="category" value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="CONFERENCE">Conference</option>
              <option value="WORSHIP">Worship & Prayer</option>
              <option value="YOUTH">Youth / Eaglets</option>
              <option value="WOMEN">Women / Lioness</option>
              <option value="MINISTERS">Ministers</option>
            </SelectField>
            <SelectField label="Status" name="status" value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="PUBLISHED">Published Live</option>
              <option value="DRAFT">Draft</option>
              <option value="CANCELLED">Cancelled</option>
            </SelectField>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Details about this event..." className="input-base resize-none" />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
            <button type="button" onClick={() => setModalOpen(false)}
              className="px-4 py-2.5 rounded-full text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary text-xs px-6 py-2.5 disabled:opacity-50">
              {saving ? 'Saving...' : editEvent ? <><Save className="w-3.5 h-3.5" /> Update Event</> : 'Publish Event'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Preview Modal ── */}
      {previewEvent && (
        <Modal isOpen={Boolean(previewEvent)} onClose={() => setPreviewEvent(null)} title="Event Summary">
          <div className="space-y-4">
            <div className="w-full h-40 rounded-2xl bg-cover bg-center flex items-end p-4 relative overflow-hidden" style={{ backgroundImage: `url(${previewEvent.imageUrl})` }}>
              <div className="hero-overlay absolute inset-0" />
              <div className="relative text-white">
                <Badge variant="accent">{previewEvent.category}</Badge>
                <h3 className="font-display font-bold text-lg mt-1">{previewEvent.title}</h3>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{previewEvent.description || 'Join us for this powerful apostolic gathering of believers.'}</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5"><span className="text-gray-400">Location</span><p className="font-semibold text-gray-900 dark:text-white mt-0.5">{previewEvent.location}</p></div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5"><span className="text-gray-400">Date</span><p className="font-semibold text-gray-900 dark:text-white mt-0.5">{new Date(previewEvent.startDate).toLocaleDateString()}</p></div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5"><span className="text-gray-400">Status</span><p className="font-semibold text-gray-900 dark:text-white mt-0.5">{previewEvent.status}</p></div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5"><span className="text-gray-400">Category</span><p className="font-semibold text-gray-900 dark:text-white mt-0.5">{previewEvent.category}</p></div>
            </div>
            <div className="pt-4 flex justify-end gap-3">
              {hasRole('ADMIN') && (
                <button type="button" onClick={() => { setPreviewEvent(null); openEdit(previewEvent); }}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-1.5 transition-colors">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
              )}
              <button type="button" onClick={() => setPreviewEvent(null)} className="btn-primary text-xs px-5 py-2">Close</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Delete Confirm ── */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Event" size="sm">
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-7 h-7 text-red-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">Are you sure you want to delete this event? This cannot be undone.</p>
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

export default AdminEventsPage;
