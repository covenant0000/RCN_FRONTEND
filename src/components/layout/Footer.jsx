import { Link } from 'react-router-dom';
import {
  Flame, MonitorPlay, ThumbsUp, Camera, Send,
  MapPin, Phone, Mail, Heart, ChevronRight
} from 'lucide-react';
import { SOCIAL_LINKS } from '../../constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white">
      {/* CTA Strip */}
      <div className="bg-accent-gradient py-12">
        <div className="container-custom text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
            Be Part of the Remnant
          </h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Join thousands of believers striving toward the rebirth of Apostolic Christianity worldwide.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="btn-ghost border border-white/30 hover:border-white">
              Join Our Community
            </Link>
            <Link to="/give" className="keep-white bg-white text-accent px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/90 transition-all inline-flex items-center gap-2 shadow-sm">
              <Heart className="w-4 h-4" /> Give Today
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="container-custom grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-accent-gradient flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-display font-bold text-lg leading-tight">RCN</div>
                <div className="text-xs text-white/50 leading-tight">Remnant Christian Network</div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              An interdenominational international ministry with the mandate of restoring apostolic order and Christianity as seen in the days of the first apostles.
            </p>
            <div className="flex items-center gap-3">
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <MonitorPlay className="w-4 h-4" />
              </a>
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <ThumbsUp className="w-4 h-4" />
              </a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Camera className="w-4 h-4" />
              </a>
              <a href={SOCIAL_LINKS.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest text-accent mb-5">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'About RCN', path: '/about' },
                { label: 'Our Sermons', path: '/sermons' },
                { label: 'Upcoming Events', path: '/events' },
                { label: 'Announcements', path: '/announcements' },
                { label: 'Departments', path: '/departments' },
                { label: 'RCN Centers', path: '/resources/centers' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="flex items-center gap-2 text-sm text-white/60 hover:text-accent transition-colors group">
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* E-Church */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest text-accent mb-5">E-Church</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Prayer Request', path: '/prayer' },
                { label: 'Share Testimony', path: '/testimony' },
                { label: 'Member Registration', path: '/register' },
                { label: 'Give Online', path: '/give' },
                { label: 'Member Login', path: '/login' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="flex items-center gap-2 text-sm text-white/60 hover:text-accent transition-colors group">
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest text-accent mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/60">
                  RCN International Centre, Makurdi, Benue State, Nigeria
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <a href="tel:+2348000000000" className="text-sm text-white/60 hover:text-accent transition-colors">
                  +234 800 000 0000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <a href="mailto:info@rcnglobal.org" className="text-sm text-white/60 hover:text-accent transition-colors">
                  info@rcnglobal.org
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-5">
        <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/40">
          <p>© {currentYear} Remnant Christian Network. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-accent transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
