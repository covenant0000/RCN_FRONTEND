import { useState, useRef } from 'react';
import {
  Plus, PlayCircle, Edit, Trash2, FileText, BookOpen, Search,
  Sparkles, CheckCircle2, AlertCircle, X, Save, Eye, EyeOff, Globe,
} from 'lucide-react';
import { Badge, EmptyState, Modal, FormField, SelectField } from '../../components/ui';
import { mockSermons } from '../../services/mock/mockData';
import { sermonsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Toast = ({ message, type, onDismiss }) => (
  <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium animate-fade-in ${type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
    {type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
    {message}
    <button onClick={onDismiss} className="ml-2 opacity-70 hover:opacity-100"><X className="w-4 h-4" /></button>
  </div>
);

const EMPTY_FORM = { title: '', speaker: 'Dr. Arome Osaghae', series: 'Kingdom Mysteries', duration: 5400, videoUrl: '', description: '', preachedAt: '' };

const formatDuration = (s) => { const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); return h > 0 ? `${h}h ${m}m` : `${m}m`; };

const AdminSermonsPage = () => {
  const { hasRole } = useAuth();
  const [sermons, setSermons]           = useState(mockSermons);
  const [search, setSearch]             = useState('');
  const [transcribingId, setTranscribingId] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editSermon, setEditSermon]     = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [saving, setSaving]             = useState(false);
  const [toast, setToast]               = useState(null);
  const toastTimer = useRef(null);

  const showToast = (message, type = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  const openAdd  = () => { setEditSermon(null); setForm(EMPTY_FORM); setAddModalOpen(true); };
  const openEdit = (sermon) => {
    setEditSermon(sermon);
    setForm({
      title: sermon.title || '', speaker: sermon.speaker || '', series: sermon.series || '',
      duration: sermon.duration || 5400, videoUrl: sermon.videoUrl || '',
      description: sermon.description || '', preachedAt: sermon.preachedAt?.slice(0, 10) || '',
    });
    setAddModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));

    if (editSermon) {
      setSermons((prev) => prev.map((s) => s.id === editSermon.id ? { ...s, ...form } : s));
      showToast('Sermon updated successfully.');
    } else {
      setSermons((prev) => [
        { id: `ser-${Date.now()}`, ...form, preachedAt: form.preachedAt || new Date().toISOString(), thumbnailUrl: '/sermon-bg.jpg', status: 'PUBLISHED', hasTranscript: false },
        ...prev,
      ]);
      showToast('Sermon uploaded and published.');
    }
    setSaving(false);
    setAddModalOpen(false);
  };

  const handleDelete = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    setSermons((prev) => prev.filter((s) => s.id !== deleteConfirm));
    setSaving(false);
    setDeleteConfirm(null);
    showToast('Sermon deleted from library.');
  };

  const togglePublish = async (sermon) => {
    const isPublished = sermon.status === 'PUBLISHED';
    try {
      if (isPublished) await sermonsAPI.unpublishSermon(sermon.id);
      else await sermonsAPI.publishSermon(sermon.id);
    } catch { /* offline fallback */ }
    setSermons((prev) =>
      prev.map((s) => s.id === sermon.id ? { ...s, status: isPublished ? 'DRAFT' : 'PUBLISHED' } : s)
    );
    showToast(isPublished ? 'Sermon unpublished — hidden from public.' : 'Sermon published — now visible publicly.');
  };

  const requestTranscription = async (sermonId) => {
    setTranscribingId(sermonId);
    try { await sermonsAPI.requestTranscription(sermonId); } catch { /* offline */ }
    showToast('AI transcription job initiated.');
    setTranscribingId(null);
  };

  const filteredSermons = sermons.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.series?.toLowerCase().includes(search.toLowerCase()) ||
    s.speaker.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-white/10">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Apostolic Sermon Library</h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage audio teachings, video broadcasts and automated AI transcriptions.</p>
        </div>
        {hasRole('PASTOR') && (
          <button type="button" onClick={openAdd} className="btn-primary text-xs px-5 py-2.5 shrink-0 self-start sm:self-auto" id="add-sermon">
            <Plus className="w-4 h-4" /> Upload New Sermon
          </button>
        )}
      </div>

      {/* AI banner */}
      <div className="bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 rounded-2xl p-4 flex items-start gap-3.5">
        <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-semibold text-blue-900 dark:text-blue-200">AI Speech-to-Text Transcription Integration</p>
          <p className="text-blue-700 dark:text-blue-300 mt-0.5">Click the transcription icon to queue audio extraction and generate study notes automatically.</p>
        </div>
      </div>

      {/* metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-primary dark:text-white">{sermons.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Total Teachings</p>
        </div>
        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{sermons.filter((s) => s.status === 'PUBLISHED').length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Published</p>
        </div>
        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-accent">{sermons.filter((s) => s.hasTranscript).length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Transcribed</p>
        </div>
      </div>

      {/* search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search by sermon title, series, or preacher..."
          value={search} onChange={(e) => setSearch(e.target.value)} className="input-base pl-10" />
      </div>

      {/* table */}
      {filteredSermons.length === 0 ? (
        <EmptyState icon={BookOpen} title="No sermons found" message="Upload your first apostolic teaching or reset your search." />
      ) : (
        <div className="bg-white dark:bg-[#12101e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm text-left">
              <thead className="border-b border-gray-100 dark:border-white/10 bg-gray-50/70 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Teaching Details</th>
                  <th className="px-5 py-3.5 hidden sm:table-cell">Series</th>
                  <th className="px-5 py-3.5 hidden md:table-cell">Duration</th>
                  <th className="px-5 py-3.5">Transcript</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredSermons.map((sermon) => (
                  <tr key={sermon.id} className="hover:bg-gray-50/70 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-cover bg-center shrink-0 relative overflow-hidden shadow-sm" style={{ backgroundImage: `url(${sermon.thumbnailUrl})` }}>
                          <div className="absolute inset-0 bg-primary/40 flex items-center justify-center"><PlayCircle className="w-4 h-4 text-white" /></div>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white text-xs md:text-sm truncate">{sermon.title}</p>
                          <p className="text-[11px] text-gray-400">{sermon.speaker}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell"><Badge variant="accent">{sermon.series}</Badge></td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs hidden md:table-cell">{formatDuration(sermon.duration)}</td>
                    <td className="px-5 py-4">
                      {sermon.hasTranscript ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Transcribed
                        </span>
                      ) : (
                        <button type="button" onClick={() => requestTranscription(sermon.id)} disabled={transcribingId === sermon.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-accent transition-colors">
                          <FileText className="w-3 h-3 text-accent" />
                          {transcribingId === sermon.id ? 'Processing...' : 'Run AI'}
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={sermon.status === 'PUBLISHED' ? 'success' : 'warning'}>{sermon.status}</Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {hasRole('PASTOR') && (
                          <>
                            <button type="button" onClick={() => togglePublish(sermon)}
                              className={`p-1.5 rounded-lg transition-colors ${sermon.status === 'PUBLISHED' ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30' : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'}`}
                              title={sermon.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}>
                              {sermon.status === 'PUBLISHED' ? <EyeOff className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                            </button>
                            <button type="button" onClick={() => openEdit(sermon)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="Edit sermon">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button type="button" onClick={() => setDeleteConfirm(sermon.id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors" title="Delete sermon">
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

      {/* ── Add / Edit Modal ── */}
      <Modal isOpen={addModalOpen} onClose={() => { setAddModalOpen(false); setEditSermon(null); }} title={editSermon ? 'Edit Sermon' : 'Upload Sermon / Audio Teaching'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Sermon Title" name="title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. The Mystery of Apostolic Grace" />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Preacher / Speaker" name="speaker" value={form.speaker}
              onChange={(e) => setForm({ ...form, speaker: e.target.value })} required />
            <FormField label="Teaching Series" name="series" value={form.series}
              onChange={(e) => setForm({ ...form, series: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Date Preached" name="preachedAt" type="date" value={form.preachedAt}
              onChange={(e) => setForm({ ...form, preachedAt: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Duration (minutes)</label>
              <input type="number" min={1} value={Math.floor(form.duration / 60)}
                onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value || '0') * 60 })}
                className="input-base" placeholder="e.g. 90" />
            </div>
          </div>
          <FormField label="Video Streaming Link (YouTube/Vimeo)" name="videoUrl" value={form.videoUrl}
            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description / Summary</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description of this teaching..." className="input-base resize-none" />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
            <button type="button" onClick={() => { setAddModalOpen(false); setEditSermon(null); }}
              className="px-4 py-2.5 rounded-full text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary text-xs px-6 py-2.5 disabled:opacity-50">
              {saving ? 'Saving...' : editSermon ? <><Save className="w-3.5 h-3.5" /> Update Sermon</> : 'Save Teaching'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Delete Confirm ── */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Sermon" size="sm">
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-7 h-7 text-red-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">Are you sure you want to delete this sermon from the library? This cannot be undone.</p>
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

export default AdminSermonsPage;
