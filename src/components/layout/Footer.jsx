import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Heart, ChevronRight } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaYoutube, FaXTwitter } from 'react-icons/fa6';
import rcnLogo from '../../assets/images/rcn-logo.png';

// Social media URLs — edit your real links here:
const socialLinks = {
  facebook: '#',
  instagram: '#',
  youtube: '#',
  x: '#',
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FAF8F2] dark:bg-[#14213D] text-[#252525] dark:text-white border-t border-[#D4A84F]/30 dark:border-white/10">
      {/* CTA Strip - Flat Solid Deep Navy with Warm Gold button */}
      <div className="footer-cta-banner bg-[#14213D] border-b border-white/10 py-12">
        <div className="container-custom text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
            Be Part of the Remnant
          </h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Join thousands of believers striving toward the rebirth of Apostolic Christianity worldwide.
          </p>
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <Link
              to="/register"
              className="btn-ghost border border-white/30 text-white hover:border-[#D4A84F] hover:text-[#D4A84F]"
            >
              Join Our Community
            </Link>
            <Link
              to="/give"
              className="bg-[#D4A84F] text-[#14213D] hover:bg-[#E0BA68] px-6 py-3 rounded-full font-semibold text-sm inline-flex items-center gap-2 shadow-sm transition-colors"
            >
              <Heart className="w-4 h-4 fill-current" /> Give Today
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="container-custom grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="mb-5">
              <Link to="/" className="inline-flex items-center">
                <img
                  src={rcnLogo}
                  alt="Remnant Christian Network Anambra"
                  className="h-14 w-auto logo-glow"
                />
              </Link>
            </div>
            <p className="text-[#252525] dark:text-white/80 text-[15px] leading-relaxed mb-5">
              An interdenominational international ministry with the mandate of restoring apostolic order and Christianity as seen in the days of the first apostles.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white dark:bg-[#141F36] border border-[#14213D]/10 dark:border-white/10 shadow-sm text-[#1877F2] hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white flex items-center justify-center transition-colors duration-200"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white dark:bg-[#141F36] border border-[#14213D]/10 dark:border-white/10 shadow-sm text-[#E4405F] hover:bg-[#E4405F] hover:border-[#E4405F] hover:text-white flex items-center justify-center transition-colors duration-200"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-white dark:bg-[#141F36] border border-[#14213D]/10 dark:border-white/10 shadow-sm text-[#FF0000] hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white flex items-center justify-center transition-colors duration-200"
              >
                <FaYoutube className="w-4 h-4" />
              </a>
              <a
                href={socialLinks.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-9 h-9 rounded-full bg-white dark:bg-[#141F36] border border-[#14213D]/10 dark:border-white/10 shadow-sm text-[#000000] dark:text-white hover:bg-[#000000] dark:hover:bg-white hover:border-[#000000] dark:hover:border-white hover:text-white dark:hover:text-[#000000] flex items-center justify-center transition-colors duration-200"
              >
                <FaXTwitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest text-[#14213D] dark:text-[#D4A84F] mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A84F]" />
              Quick Links
            </h3>
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
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-[15px] text-[#252525] dark:text-white/80 hover:text-[#D4A84F] dark:hover:text-[#D4A84F] transition-colors group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#D4A84F] group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* E-Church */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest text-[#14213D] dark:text-[#D4A84F] mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A84F]" />
              E-Church
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Prayer Request', path: '/prayer' },
                { label: 'Share Testimony', path: '/testimony' },
                { label: 'Member Registration', path: '/register' },
                { label: 'Give Online', path: '/give' },
                { label: 'Member Login', path: '/login' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-[15px] text-[#252525] dark:text-white/80 hover:text-[#D4A84F] dark:hover:text-[#D4A84F] transition-colors group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#D4A84F] group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest text-[#14213D] dark:text-[#D4A84F] mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A84F]" />
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D4A84F] mt-0.5 flex-shrink-0" />
                <span className="text-[15px] text-[#252525] dark:text-white/80">
                  RCN International Centre, Makurdi, Benue State, Nigeria
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#D4A84F] flex-shrink-0" />
                <a
                  href="tel:+2348000000000"
                  className="text-[15px] text-[#252525] dark:text-white/80 hover:text-[#D4A84F] dark:hover:text-[#D4A84F] transition-colors"
                >
                  +234 800 000 0000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D4A84F] flex-shrink-0" />
                <a
                  href="mailto:info@rcnglobal.org"
                  className="text-[15px] text-[#252525] dark:text-white/80 hover:text-[#D4A84F] dark:hover:text-[#D4A84F] transition-colors"
                >
                  info@rcnglobal.org
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#14213D]/10 dark:border-white/10 py-5">
        <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <p className="text-[15px] text-[#6B7280] dark:text-white/60">
            © {currentYear} Remnant Christian Network. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/privacy"
              className="text-[15px] text-[#6B7280] dark:text-white/60 hover:text-[#D4A84F] dark:hover:text-[#D4A84F] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-[15px] text-[#6B7280] dark:text-white/60 hover:text-[#D4A84F] dark:hover:text-[#D4A84F] transition-colors"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
