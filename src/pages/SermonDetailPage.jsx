import { useParams, Link } from 'react-router-dom';
import { Play, Clock, Calendar, ArrowLeft, Headphones, FileText, Share2 } from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import { Badge, Card, EmptyState } from '../components/ui';
import { mockSermons } from '../services/mock/mockData';
import { useAuth } from '../context/AuthContext';

const SermonDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const sermon = mockSermons.find((s) => s.id === id);

  if (!sermon) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <EmptyState
            icon={Play}
            title="Sermon Not Found"
            message="This sermon may have been removed."
            action={<Link to="/sermons" className="btn-primary">Browse Sermons</Link>}
          />
        </div>
      </PublicLayout>
    );
  }

  const related = mockSermons
    .filter((s) => s.id !== id && s.series === sermon.series)
    .slice(0, 4);

  const formatDuration = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m} min`;
  };

  return (
    <PublicLayout>
      <div className="bg-primary-gradient pt-24 pb-10">
        <div className="container-custom">
          <Link to="/sermons" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Sermons
          </Link>
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Thumbnail */}
            <div className="lg:col-span-2">
              <div
                className="relative rounded-2xl overflow-hidden aspect-video bg-cover bg-center"
                style={{ backgroundImage: `url(${sermon.thumbnailUrl})` }}
              >
                <div className="absolute inset-0 bg-primary/60 flex items-center justify-center">
                  <button className="w-20 h-20 rounded-full bg-accent/90 flex items-center justify-center hover:bg-accent transition-all hover:scale-110 shadow-2xl">
                    <Play className="w-9 h-9 text-white ml-1" />
                  </button>
                </div>
              </div>
            </div>
            {/* Quick Info */}
            <div className="text-white space-y-4">
              <Badge variant="accent">{sermon.series}</Badge>
              <h1 className="font-display text-2xl font-bold leading-tight">{sermon.title}</h1>
              <p className="text-white/70 text-sm">{sermon.speaker}</p>
              <div className="space-y-2 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  {new Date(sermon.preachedAt).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent" />
                  {formatDuration(sermon.duration)}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {sermon.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 bg-white/10 text-white/70 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <a href={sermon.audioUrl} className="btn-primary flex-1 justify-center text-sm">
                  <Headphones className="w-4 h-4" /> Listen
                </a>
                <button className="btn-ghost border border-white/30 px-3">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="section-padding bg-white">
        <div className="container-custom grid lg:grid-cols-3 gap-10">
          {/* About + Transcript */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-display text-xl font-bold text-primary mb-3">About This Message</h2>
              <p className="text-[#6B7280] leading-relaxed">{sermon.description}</p>
            </div>

            {/* Transcript Section */}
            <div className="border border-[rgba(20,33,61,0.08)] rounded-2xl p-6 bg-[#FAF8F2]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-primary flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent" /> Sermon Transcript
                </h3>
                {sermon.hasTranscript && <Badge variant="accent">Available</Badge>}
              </div>
              {sermon.hasTranscript ? (
                isAuthenticated ? (
                  <div>
                    <p className="text-[#6B7280] text-sm mb-4">
                      Full transcript is available for members. Click below to read.
                    </p>
                    <button className="btn-primary text-sm">
                      Read Full Transcript
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-[#6B7280] text-sm mb-4">
                      Transcripts are available to registered members only.
                    </p>
                    <Link to="/login" className="btn-primary text-sm">
                      Sign In to Access
                    </Link>
                  </div>
                )
              ) : (
                <p className="text-[#6B7280] text-sm">
                  Transcript not yet available for this sermon. Check back later.
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {related.length > 0 && (
              <div>
                <h3 className="font-semibold text-primary mb-4">More from {sermon.series}</h3>
                <div className="space-y-3">
                  {related.map((s) => (
                    <Link key={s.id} to={`/sermons/${s.id}`} className="flex gap-3 group p-3 rounded-xl hover:bg-[#FAF8F2] transition-colors">
                      <div
                        className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
                        style={{ backgroundImage: `url(${s.thumbnailUrl})` }}
                      />
                      <div>
                        <p className="text-sm font-medium text-[#252525] group-hover:text-accent transition-colors line-clamp-2">
                          {s.title}
                        </p>
                        <p className="text-xs text-[#6B7280] mt-1">{formatDuration(s.duration)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default SermonDetailPage;
