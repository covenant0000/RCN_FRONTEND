import { Heart, Globe, BookOpen, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { SectionHeader } from '../components/ui';

const pillars = [
  { icon: '🙏', title: 'Prayer', desc: 'Fervent, persistent prayer is the heartbeat of RCN. We believe prayer births revival and ushers in the Kingdom.' },
  { icon: '📖', title: 'Study of the Word', desc: 'Deep, systematic exposition of Scripture shapes our understanding of God, man, and eternity.' },
  { icon: '🍞', title: 'Breaking of Bread', desc: 'Fellowship and communion knit us together as one body, remembering Christ until He comes.' },
];

const ministries = [
  { name: 'Worship & Arts', desc: 'Expressing the beauty and majesty of God through music, drama, and creative arts.', icon: '🎵' },
  { name: 'Prayer Ministry', desc: 'Intercession, prayer altars, and watching unto prayer for the church and nations.', icon: '🕯️' },
  { name: 'Evangelism', desc: 'Taking the apostolic gospel to unreached places through crusades and outreaches.', icon: '📣' },
  { name: "Children's Ministry", desc: 'Raising a generation of kingdom-minded young believers anchored in the Word.', icon: '⭐' },
  { name: 'Media & Technology', desc: 'Extending the reach of RCN through broadcast, digital media, and technology.', icon: '📡' },
  { name: 'Adullam Seminary', desc: 'Intensive apostolic training for ministers and workers in the body of Christ.', icon: '🎓' },
];

const AboutPage = () => (
  <PublicLayout>
    {/* Hero */}
    <div
      className="relative pt-20 h-80 md:h-[450px] bg-cover bg-center flex items-end"
      style={{ backgroundImage: 'url(/community-bg.jpg)' }}
    >
      <div className="hero-overlay absolute inset-0" />
      <div className="relative container-custom pb-12 text-white">
        <nav className="mb-4 text-white/60 text-sm">Home / About</nav>
        <h1 className="font-display text-4xl md:text-5xl font-bold">About RCN</h1>
      </div>
    </div>

    {/* Mission */}
    <section className="section-padding bg-white">
      <div className="container-custom grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-accent text-xs font-semibold uppercase tracking-[0.2em] mb-3">Our Identity</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-5">
            Remnant Christian Network
          </h2>
          <p className="text-[#6B7280] leading-relaxed mb-5">
            Remnant Christian Network (RCN) is an interdenominational and non-denominational international
            Ministry to the body of Christ with the mandate of restoring the apostolic order and Christianity
            as was seen in the days of the first generation of apostles of Jesus Christ, and thereby heralding
            the coming of the Lord Jesus Christ in this end of the age.
          </p>
          <p className="text-[#6B7280] leading-relaxed mb-8">
            We seek only to see the coming of the King and His Kingdom until His reality is furnished in the
            hearts of the sons of men. We are not a denomination — we are a movement of believers committed
            to the apostolic heritage of the Christian faith.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Heart, label: 'Non-Denominational' },
              { icon: Globe, label: 'International Reach' },
              { icon: BookOpen, label: 'Word-Centred' },
              { icon: Users, label: 'Kingdom-Focused' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-sm text-[#252525]">
                <Icon className="w-4 h-4 text-accent" /> {label}
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 h-[420px]">
          <div className="rounded-2xl bg-cover bg-center row-span-2 shadow-xl" style={{ backgroundImage: 'url(/hero-bg.jpg)' }} />
          <div className="rounded-2xl bg-cover bg-center shadow-lg" style={{ backgroundImage: 'url(/sermon-bg.jpg)' }} />
          <div className="rounded-2xl bg-cover bg-center shadow-lg" style={{ backgroundImage: 'url(/conference-bg.jpg)' }} />
        </div>
      </div>
    </section>

    {/* Visit Our Centre CTA */}
    <section className="py-12 bg-[#FAF8F2] dark:bg-[#0D1527] border-y border-[rgba(20,33,61,0.06)] dark:border-white/10">
      <div className="container-custom">
        <div className="bg-white dark:bg-[#141F36] rounded-2xl shadow-sm border border-[rgba(20,33,61,0.08)] dark:border-white/10 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-[#14213D] dark:text-white mb-2">
              Visit our centre
            </h3>
            <p className="text-[#6B7280] dark:text-[#D1D5DB] text-base">
              See where and when we gather at RCN Anambra
            </p>
          </div>
          <Link
            to="/our-centre"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm bg-[#D4A84F] text-[#14213D] hover:bg-[#E0BA68] transition-colors shadow-sm flex-shrink-0"
          >
            RCN Anambra Centre &rarr;
          </Link>
        </div>
      </div>
    </section>

    {/* Three Pillars */}
    <section className="section-padding bg-primary-gradient text-white">
      <div className="container-custom">
        <SectionHeader
          eyebrow="Our Foundation"
          title="Three Pillars of RCN"
          description="The core instruments through which we pursue our mandate"
          light
          className="mb-12"
        />
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <div key={p.title} className="glass rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">{p.icon}</div>
              <h3 className="font-display text-xl font-bold text-white mb-3">{p.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Leadership */}
    <section className="section-padding bg-[#FAF8F2]">
      <div className="container-custom max-w-4xl mx-auto text-center">
        <p className="text-accent text-xs font-semibold uppercase tracking-[0.2em] mb-3">Leadership</p>
        <h2 className="font-display text-3xl font-bold text-primary mb-12">Apostolic Leadership</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-[rgba(20,33,61,0.08)] p-10 flex flex-col md:flex-row items-center gap-8">
          <div
            className="w-36 h-36 rounded-full bg-cover bg-center flex-shrink-0 shadow-xl border-4 border-accent/30"
            style={{ backgroundImage: 'url(/sermon-bg.jpg)', backgroundPosition: 'top' }}
          />
          <div className="text-left">
            <h3 className="font-display text-2xl font-bold text-primary mb-1">Dr. Arome Osaghae</h3>
            <p className="text-accent font-medium text-sm mb-3">Presiding Apostle, RCN</p>
            <p className="text-[#6B7280] leading-relaxed text-sm">
              Dr. Arome Osaghae is a teacher, preacher, and apostle of the gospel with a burning passion for
              restoring the apostolic heritage of the Christian faith. Through decades of ministry, he has
              raised up thousands of believers and ministers across Nigeria and the nations.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Ministries */}
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeader
          eyebrow="What We Do"
          title="Our Ministries"
          description="Serving the body of Christ through diverse expressions of Kingdom ministry"
          className="mb-12"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ministries.map((m) => (
            <div key={m.name} className="p-6 border border-[rgba(20,33,61,0.08)] rounded-2xl hover:border-accent/30 hover:shadow-md transition-all group">
              <div className="text-3xl mb-3">{m.icon}</div>
              <h3 className="font-semibold text-primary mb-2 group-hover:text-accent transition-colors">{m.name}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="section-padding bg-[#FAF8F2]">
      <div className="container-custom text-center max-w-xl mx-auto">
        <h2 className="font-display text-3xl font-bold text-primary mb-4">Ready to Connect?</h2>
        <p className="text-[#6B7280] mb-8">Join the RCN community and grow in your walk with God.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/register" className="btn-primary">Join RCN <ArrowRight className="w-4 h-4" /></Link>
          <Link to="/prayer" className="btn-secondary">Prayer Request</Link>
        </div>
      </div>
    </section>
  </PublicLayout>
);

export default AboutPage;
