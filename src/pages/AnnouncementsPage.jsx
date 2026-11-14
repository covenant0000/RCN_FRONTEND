import { useState, useEffect } from 'react';
import { Bell, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import { PageHero, Badge, LoadingScreen, EmptyState, Pagination } from '../components/ui';
import { mockAnnouncements, paginateMock } from '../services/mock/mockData';

const priorityVariant = { HIGH: 'danger', MEDIUM: 'warning', LOW: 'accent' };
const priorityLabel = { HIGH: 'Urgent', MEDIUM: 'Important', LOW: 'General' };

const AnnouncementCard = ({ ann }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-[rgba(20,33,61,0.08)] p-6 shadow-sm hover:border-accent/30 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant={priorityVariant[ann.priority] || 'accent'}>
              {priorityLabel[ann.priority] || ann.priority}
            </Badge>
            <span className="text-xs text-[#6B7280] bg-[#F0EDE5] px-2 py-0.5 rounded-full">
              {ann.category}
            </span>
          </div>
          <h3 className="font-semibold text-[#252525] mb-2">{ann.title}</h3>
          <p className={`text-sm text-[#6B7280] leading-relaxed ${!expanded ? 'line-clamp-2' : ''}`}>
            {ann.content}
          </p>
          {ann.content.length > 120 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-xs text-accent font-medium hover:underline flex items-center gap-1"
            >
              {expanded ? <><ChevronUp className="w-3.5 h-3.5" />Show less</> : <><ChevronDown className="w-3.5 h-3.5" />Read more</>}
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#6B7280] whitespace-nowrap flex-shrink-0">
          <Calendar className="w-3.5 h-3.5" />
          {new Date(ann.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>
    </div>
  );
};

const AnnouncementsPage = () => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({ data: [], pagination: null });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setResult(paginateMock(mockAnnouncements, page, 6));
      setLoading(false);
    }, 300);
  }, [page]);

  return (
    <PublicLayout>
      <PageHero
        title="Announcements"
        subtitle="Stay informed with the latest updates, schedules, and news from RCN"
        breadcrumb={['Home', 'Announcements']}
      />

      <section className="section-padding bg-[#FAF8F2]">
        <div className="container-custom max-w-3xl mx-auto">
          {loading ? (
            <LoadingScreen message="Loading announcements..." />
          ) : result.data.length === 0 ? (
            <EmptyState icon={Bell} title="No announcements" message="Check back soon for updates." />
          ) : (
            <>
              <div className="space-y-4">
                {result.data.map((ann) => (
                  <AnnouncementCard key={ann.id} ann={ann} />
                ))}
              </div>
              <Pagination
                pagination={result.pagination}
                onPageChange={(p) => { setPage(p); window.scrollTo(0, 0); }}
              />
            </>
          )}
        </div>
      </section>
    </PublicLayout>
  );
};

export default AnnouncementsPage;
