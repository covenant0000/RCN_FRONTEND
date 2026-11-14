import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlayCircle, ChevronRight, Calendar, BookOpen,
  Heart, Globe, Mic, Users, Star, ArrowRight,
  MonitorPlay, Radio, Tv, Send, Smartphone
} from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import { SectionHeader, Card, Badge } from '../components/ui';
import {
  mockSermons, mockEvents, mockAnnouncements
} from '../services/mock/mockData';
import { sermons as allSermons } from '../data/sermons';
import heroWelcome2 from '../assets/images/hero-welcome2.jpeg';
import heroApostolic from '../assets/images/hero-apostolic.jpeg';
import heroConference from '../assets/images/hero-conference.jpeg';
import pastor1 from '../assets/images/pastor1.jpeg';
import pastor2 from '../assets/images/pastor2.jpeg';
import pastor3 from '../assets/images/pastor3.jpeg';

// ─── Hero Section ─────────────────────────────────────────────────────────

const Hero = () => {
  const slides = [
    {
      title: 'Welcome to',
      boldTitle: 'Remnant Christian Network',
      subtitle: 'Striving toward the rebirth of Apostolic Christianity',
      image: heroWelcome2,
      objectPosition: 'center 22%',
      cta: { label: 'Join Our Community', path: '/register' },
      ctaSecondary: { label: 'Watch Sermons', path: '/sermons' },
    },
    {
      title: 'Apostolic',
      boldTitle: 'Christianity Restored',
      subtitle: 'Prayers · Study of the Word · Breaking of Bread',
      image: heroApostolic,
      objectPosition: 'center 12%',
      cta: { label: 'Explore Sermons', path: '/sermons' },
      ctaSecondary: { label: 'Prayer Request', path: '/prayer' },
    },
    {
      title: 'Upcoming',
      boldTitle: 'Kingdom Come Conference',
      subtitle: 'Experience a gathering of the saints like never before',
      image: heroConference,
      cta: { label: 'View Events', path: '/events' },
      ctaSecondary: { label: 'Give', path: '/give' },
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[current];

  return (
    <section className="relative h-screen min-h-[700px] md:min-h-[800px] overflow-hidden">
      {/* Background Images */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Main image */}
          <img
            src={s.image}
            alt={s.boldTitle}
            style={s.objectPosition ? { objectPosition: s.objectPosition } : undefined}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/65" />

      {/* Content */}
      <div className="relative z-10 h-full container-custom flex flex-col justify-end items-center text-center pb-24">
        <div key={current} className="animate-fade-in-up max-w-4xl">
          <p className="text-accent text-sm font-semibold uppercase tracking-[0.25em] mb-4">
            Remnant Christian Network
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6 drop-shadow-lg [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]">
            {slide.title}{' '}
            <span className="block text-white">{slide.boldTitle}</span>
          </h1>
          <p className="text-white/75 text-lg md:text-xl max-w-xl mx-auto mb-10 drop-shadow-lg">
            {slide.subtitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Primary hero button: solid #D4A84F at 100% opacity, solid #14213D text */}
            <Link
              to={slide.cta.path}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#D4A84F] hover:bg-[#E0BA68] text-[#14213D] hover:text-[#14213D] font-semibold text-base transition-colors shadow-sm"
            >
              {slide.cta.label}
              <ArrowRight className="w-4 h-4" />
            </Link>
            {/* Secondary hero button: solid dark navy at 75% with blur and solid white border/text */}
            <Link
              to={slide.ctaSecondary.path}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#14213D]/75 hover:bg-[#14213D]/95 backdrop-blur-[4px] text-white border-[1.5px] border-white font-semibold text-base transition-all"
            >
              <PlayCircle className="w-4 h-4" />
              {slide.ctaSecondary.label}
            </Link>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current ? 'w-8 h-2 bg-accent' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Stats Bar ────────────────────────────────────────────────────────────

const StatsBar = () => {
  const stats = [
    { value: '30+', label: 'Years of Ministry' },
    { value: '100K+', label: 'Global Members' },
    { value: '50+', label: 'Nations Reached' },
    { value: '1000+', label: 'Sermon Messages' },
  ];

  return (
    <section className="bg-primary py-10 border-b border-white/5">
      <div className="container-custom grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((stat) => (
          <div key={stat.label} className="group">
            <div className="text-3xl md:text-4xl font-display font-bold text-accent mb-1 group-hover:scale-110 transition-transform">
              {stat.value}
            </div>
            <div className="text-xs text-white/50 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ─── About Section ────────────────────────────────────────────────────────

const AboutSection = () => (
  <section className="section-padding bg-white dark:bg-[#141F36]">
    <div className="container-custom grid lg:grid-cols-2 gap-16 items-center">
      {/* Images Grid */}
      <div className="grid grid-cols-2 gap-4 h-[500px]">
        <div className="rounded-2xl overflow-hidden row-span-2 shadow-2xl">
          <img
            src={pastor1}
            alt="Pastor ministering at Remnant Christian Network"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="rounded-2xl overflow-hidden shadow-xl">
          <img
            src={pastor2}
            alt="Apostle Arome Osayi in prayer and fellowship"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="rounded-2xl overflow-hidden shadow-xl">
          <img
            src={pastor3}
            alt="Remnant Christian Network leadership and ministry"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div>
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-[#D4A84F] bg-[#D4A84F]/15 text-[#14213D] dark:text-[#D4A84F] text-xs font-semibold uppercase tracking-wider mb-4">
          Point man
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary dark:text-white uppercase tracking-tight mb-2 leading-tight">
          MEET OUR PASTOR
        </h2>
        <p className="text-xl md:text-2xl font-bold text-[#14213D] dark:text-[#D4A84F] font-display mb-4">
          Rev. Paschal Chukwudi
        </p>
        <p className="text-[#6B7280] dark:text-gray-300 text-base leading-relaxed mb-8">
          Paschal Chukwudi is the Point man of Remnant Christian Network, Anambra chapter. He is a man committed to the work of the kingdom, and God has been using him mightily to bring restoration to people's lives.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { icon: Heart, label: 'Apostolic Christianity' },
            { icon: Globe, label: 'International Reach' },
            { icon: BookOpen, label: 'Word-Centred Teaching' },
            { icon: Users, label: 'Kingdom Community' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 text-sm text-[#252525] dark:text-gray-300">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-accent" />
              </div>
              {label}
            </div>
          ))}
        </div>

        <Link
          to="/about"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#D4A84F] hover:bg-[#E0BA68] text-[#14213D] hover:text-[#14213D] font-semibold text-base transition-colors shadow-sm"
        >
          Read Full Profile →
        </Link>
      </div>
    </div>
  </section>
);

// ─── Latest Sermons Section ───────────────────────────────────────────────

const SermonsSection = () => {
  const sermons = allSermons.slice(0, 3);

  return (
    <section className="section-padding bg-[#FAF8F2] dark:bg-[#0D1527]">
      <div className="container-custom">
        <SectionHeader
          eyebrow="Audio & Video"
          title="Latest Sermons"
          description="Dive deep into the Word of God through messages from Rev Paschal Chukwudi and ministers of the RCN network."
          className="mb-12"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sermons.map((sermon) => (
            <a
              key={sermon.id}
              href={sermon.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block group h-full focus:outline-none"
            >
              <Card hover className="h-full flex flex-col overflow-hidden">
                {/* Sermon Thumbnail with teal play button in bottom-right corner */}
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

                {/* Sermon Info */}
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

        <div className="text-center mt-10">
          <Link to="/sermons" className="btn-secondary">
            View All Sermons <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// ─── Upcoming Events Section ──────────────────────────────────────────────

const EventsSection = () => {
  const events = mockEvents.slice(0, 3);

  return (
    <section className="section-padding bg-primary-gradient text-white">
      <div className="container-custom">
        <SectionHeader
          eyebrow="What's Coming"
          title="Upcoming Events"
          description="Join us at our conferences, conventions, and gatherings across the globe."
          light
          className="mb-12"
        />

        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link key={event.id} to={`/events/${event.id}`}>
              <div className="bg-[#141F36] border border-white/10 hover:border-[#D4A84F]/50 rounded-2xl overflow-hidden group card-hover h-full shadow-lg transition-all">
                <div
                  className="h-44 bg-cover bg-center relative overflow-hidden"
                  style={{ backgroundImage: `url(${event.imageUrl})` }}
                >
                  <div className="absolute inset-0 bg-[#14213D]/40 group-hover:bg-[#14213D]/20 transition-all" />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-[#D4A84F] text-[#14213D] text-xs font-bold tracking-wide shadow-sm">
                      {event.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-[#D4A84F] transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-white/70 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-[#D4A84F]" />
                    <span>
                      {new Date(event.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-white/50 text-xs mt-1 line-clamp-1">{event.location}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/events" className="btn-secondary">
            View All Events <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// ─── Media Channels Section ───────────────────────────────────────────────

const MediaSection = () => {
  const channels = [
    {
      icon: MonitorPlay,
      title: 'YouTube Channel',
      description: "Don't miss a service. Subscribe to our YouTube channel to get notifications of our programs.",
      link: 'https://youtube.com',
      cta: 'Subscribe Now',
      color: 'bg-[#FAF8F2] dark:bg-[#1F2D4A] text-[#D4A84F]',
    },
    {
      icon: Globe,
      title: 'Facebook',
      description: 'Join our Facebook community. Get updates and watch Facebook streams with any device.',
      link: 'https://facebook.com',
      cta: 'Follow Us',
      color: 'bg-[#EEF0F4] text-[#14213D]',
    },
    {
      icon: Tv,
      title: 'Satellite TV',
      description: 'We are closer than you think. Watch us on satellite or download the Voice of One TV mobile app.',
      link: '#',
      cta: 'Watch Now',
      color: 'bg-[#F5F0E8] text-[#14213D]',
    },
    {
      icon: Send,
      title: 'Telegram',
      description: 'Join our Telegram community to download our audio sermons and get daily updates.',
      link: 'https://t.me',
      cta: 'Join Channel',
      color: 'bg-[#EEF0F4] text-[#14213D]',
    },
    {
      icon: Radio,
      title: 'Internet Radio',
      description: 'Listen to our 24/7 Internet radio station from anywhere in the world.',
      link: '#',
      cta: 'Listen Live',
      color: 'bg-[#F5F0E8] text-[#D4A84F]',
    },
    {
      icon: Smartphone,
      title: 'Mobile App',
      description: 'Access RCN resources, sermons, and events on the go with our mobile application.',
      link: '#',
      cta: 'Download App',
      color: 'bg-[#F5F0E8] text-[#D4A84F]',
    },
  ];

  return (
    <section className="section-padding bg-white dark:bg-[#141F36]">
      <div className="container-custom">
        <SectionHeader
          eyebrow="We Are Closer Than You Think"
          title="Connect With Us"
          description="Reach us across multiple platforms and never miss a teaching, event, or update."
          className="mb-12"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {channels.map(({ icon: Icon, title, description, link, cta, color }) => (
            <a key={title} href={link} target="_blank" rel="noopener noreferrer">
              <Card hover className="p-5 h-full group">
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-[#252525] dark:text-white mb-2 group-hover:text-accent transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-4 leading-relaxed line-clamp-3">
                  {description}
                </p>
                <span className="text-xs font-semibold text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                  {cta} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Announcements Section ────────────────────────────────────────────────

const AnnouncementsSection = () => {
  const announcements = mockAnnouncements.slice(0, 3);
  const priorityColors = { HIGH: 'danger', MEDIUM: 'warning', LOW: 'accent' };

  return (
    <section className="section-padding bg-[#FAF8F2] dark:bg-[#0D1527]">
      <div className="container-custom grid lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-1">
          <p className="text-accent text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            Latest Updates
          </p>
          <h2 className="font-display text-3xl font-bold text-primary dark:text-white mb-4">
            Church Announcements
          </h2>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm leading-relaxed mb-6">
            Stay up to date with the latest news, schedules, and important information from RCN.
          </p>
          <Link to="/announcements" className="btn-primary inline-flex">
            All Announcements <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {announcements.map((ann) => (
            <Card key={ann.id} className="p-5 hover:border-accent/30 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={priorityColors[ann.priority] || 'accent'}>{ann.priority}</Badge>
                    <span className="text-xs text-[#6B7280]">{ann.category}</span>
                  </div>
                  <h3 className="font-semibold text-[#252525] dark:text-white mb-1">{ann.title}</h3>
                  <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] line-clamp-2">{ann.content}</p>
                </div>
                <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] whitespace-nowrap flex-shrink-0">
                  {new Date(ann.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Give Section ─────────────────────────────────────────────────────────

const GiveSection = () => (
  <section
    className="relative section-padding overflow-hidden"
    style={{
      backgroundImage: 'url(/community-bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <div className="hero-overlay absolute inset-0" />
    <div className="relative container-custom text-center max-w-2xl mx-auto">
      <div className="w-16 h-16 rounded-full bg-accent-gradient mx-auto flex items-center justify-center mb-6">
        <Heart className="w-8 h-8 text-white" />
      </div>
      <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-5">
        Partner with the Vision
      </h2>
      <p className="text-white/75 text-lg mb-8 leading-relaxed">
        Your giving fuels the mission of RCN — reaching nations, training workers, and establishing the Kingdom of God in the earth.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/give" className="btn-primary text-base px-8 py-4">
          <Heart className="w-5 h-5" /> Give Today
        </Link>
        <Link to="/about" className="btn-ghost border border-white/30 text-base px-8 py-4">
          Learn More
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-3 gap-6 text-white text-center">
        {[
          { label: 'Tithe & Offering', icon: '🙏' },
          { label: 'Building Fund', icon: '🏛️' },
          { label: 'Missions Support', icon: '🌍' },
        ].map((item) => (
          <div key={item.label} className="glass rounded-xl py-4 px-2">
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="text-xs text-white/70">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Testimonials Section ─────────────────────────────────────────────────

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Pastor Emmanuel O.',
      role: 'Minister, Lagos',
      text: "The teachings from RCN have fundamentally transformed my understanding of the Kingdom of God. Dr. Arome's sermons are a treasure.",
      stars: 5,
    },
    {
      name: 'Sister Grace A.',
      role: 'Member, Abuja',
      text: 'Being part of the RCN community has deepened my prayer life and hunger for the Word. I am forever grateful for this ministry.',
      stars: 5,
    },
    {
      name: 'Brother Daniel M.',
      role: 'Worker, Kano',
      text: 'IEC 2024 was a life-changing experience. The presence of God was tangible throughout the conference.',
      stars: 5,
    },
  ];

  return (
    <section className="section-padding bg-white dark:bg-[#141F36]">
      <div className="container-custom">
        <SectionHeader
          eyebrow="Testimonies"
          title="What the Community Says"
          className="mb-12"
        />
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card key={t.name} className="p-6">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <blockquote className="text-[#6B7280] dark:text-[#9CA3AF] text-sm leading-relaxed mb-5 italic">
                "{t.text}"
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-gradient flex items-center justify-center text-white font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-[#252525] dark:text-white text-sm">{t.name}</div>
                  <div className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">{t.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Main HomePage ─────────────────────────────────────────────────────────

const HomePage = () => {
  return (
    <PublicLayout>
      <Hero />
      <StatsBar />
      <AboutSection />
      <SermonsSection />
      <EventsSection />
      <MediaSection />
      <AnnouncementsSection />
      <TestimonialsSection />
      <GiveSection />
    </PublicLayout>
  );
};

export default HomePage;
