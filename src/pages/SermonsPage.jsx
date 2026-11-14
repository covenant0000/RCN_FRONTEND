import { PlayCircle } from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import { PageHero, Card } from '../components/ui';
import { sermons as allSermons } from '../data/sermons';

const SermonsPage = () => {
  return (
    <PublicLayout>
      <PageHero
        title="Sermons & Messages"
        subtitle="Dive deep into the Word of God through teachings from Rev Paschal Chukwudi"
        breadcrumb={['Home', 'Sermons']}
        bgImage="/sermon-bg.jpg"
      />

      <section className="pt-8 pb-16 md:pb-24 bg-white dark:bg-transparent">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allSermons.map((sermon) => (
              <a
                key={sermon.id}
                href={sermon.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block group h-full focus:outline-none"
              >
                <Card hover className="h-full flex flex-col overflow-hidden">
                  {/* Thumbnail with teal play button in bottom-right corner */}
                  <div className="relative h-48 w-full bg-[#F0EDE5] dark:bg-[#141F36] overflow-hidden">
                    <img
                      src={sermon.thumbnailUrl}
                      alt={sermon.title}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors duration-300" />
                    <div className="absolute bottom-3 right-3">
                      <div className="w-10 h-10 rounded-full bg-accent/90 flex items-center justify-center backdrop-blur-sm shadow-md group-hover:scale-110 transition-transform">
                        <PlayCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Info: Title, Preacher, Date */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-[#252525] dark:text-white text-base mb-1.5 group-hover:text-accent transition-colors line-clamp-2">
                        {sermon.title}
                      </h3>
                      <p className="text-sm font-medium text-[#6B7280] dark:text-gray-300 mb-2">
                        {sermon.preacher || sermon.speaker}
                      </p>
                    </div>
                    <div className="text-xs font-medium text-[#6B7280] dark:text-gray-400">
                      {sermon.date}
                    </div>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default SermonsPage;
