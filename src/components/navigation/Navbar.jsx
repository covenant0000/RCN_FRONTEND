import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu, X, ChevronDown, LogIn, LogOut, User, LayoutDashboard,
  Sun, Moon, Home, Church, BookOpen, CalendarDays, HeartHandshake
} from 'lucide-react';
import rcnLogo from '../../assets/images/rcn-logo.png';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { NAV_ITEMS } from '../../constants';
import ThemeToggle from '../ui/ThemeToggle';

// Icons for selected nav links
const NAV_ICONS = {
  Home: Home,
  About: Church,
  Resources: BookOpen,
  Events: CalendarDays,
  Give: HeartHandshake,
};

// Links that should show ICON ONLY on desktop (no text label)
const ICON_ONLY_LABELS = new Set(['Home', 'About', 'Events', 'Give']);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navRef = useRef(null);

  // Close the open dropdown when clicking outside the navbar or pressing Escape
  useEffect(() => {
    if (activeDropdown === null) return;
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setActiveDropdown(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [activeDropdown]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleDropdown = (label) => {
    setActiveDropdown((prev) => (prev === label ? null : label));
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F2] dark:bg-[#14213D] text-[#14213D] dark:text-white border-b border-[#D4A84F] dark:border-white/10"
    >
      <div className="w-full pl-4 pr-4 sm:pr-6 lg:pr-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with no box — cleanly readable in light mode on Ivory, soft glow in dark mode */}
          <Link to="/" className="flex items-center" onClick={() => setIsOpen(false)}>
            <img
              src={rcnLogo}
              alt="RCN Logo"
              className="h-16 md:h-20 w-auto pl-4 pt-1 logo-glow"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const ItemIcon = NAV_ICONS[item.label];
              const iconOnly = ICON_ONLY_LABELS.has(item.label) && !!ItemIcon;

              return item.children ? (
                <div key={item.label} className="relative group">
                  <button
                    type="button"
                    onClick={() => toggleDropdown(item.label)}
                    aria-haspopup="menu"
                    aria-expanded={activeDropdown === item.label}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-[#14213D] dark:text-white/85 hover:text-[#D4A84F] dark:hover:text-[#D4A84F] hover:bg-[#D4A84F]/10 dark:hover:bg-white/5"
                  >
                    {ItemIcon && <ItemIcon className="w-4 h-4 shrink-0" />}
                    <span>{item.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        activeDropdown === item.label ? 'rotate-180 text-[#D4A84F]' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown */}
                  <div
                    className={`absolute top-full left-0 mt-1 w-52 bg-[#FAF8F2] dark:bg-[#14213D] rounded-xl shadow-2xl border border-[#D4A84F]/30 dark:border-white/10 overflow-hidden transition-all duration-200 ${
                      activeDropdown === item.label
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
                  >
                    {item.children.map((child) =>
                      child.external ? (
                        <a
                          key={child.label}
                          href={child.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setActiveDropdown(null)}
                          className="block px-4 py-2.5 text-sm text-[#14213D] dark:text-white/85 hover:text-[#D4A84F] dark:hover:text-[#D4A84F] hover:bg-[#D4A84F]/10 dark:hover:bg-white/5 transition-colors"
                        >
                          {child.label}
                        </a>
                      ) : (
                        <Link
                          key={child.label}
                          to={child.path}
                          className="block px-4 py-2.5 text-sm text-[#14213D] dark:text-white/85 hover:text-[#D4A84F] dark:hover:text-[#D4A84F] hover:bg-[#D4A84F]/10 dark:hover:bg-white/5 transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {child.label}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.path}
                  title={iconOnly ? item.label : undefined}
                  aria-label={iconOnly ? item.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      iconOnly ? 'px-2.5 py-2' : 'px-3 py-2'
                    } ${
                      isActive
                        ? 'text-[#D4A84F] bg-[#D4A84F]/15 font-semibold border-b-2 border-[#D4A84F]'
                        : 'text-[#14213D] dark:text-white/85 hover:text-[#D4A84F] dark:hover:text-[#D4A84F] hover:bg-[#D4A84F]/10 dark:hover:bg-white/5'
                    }`
                  }
                >
                  {ItemIcon && <ItemIcon className="w-4 h-4 shrink-0" />}
                  {/* Hide text for icon-only items on desktop */}
                  {!iconOnly && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </div>

          {/* Desktop Right Side: Theme Toggle + Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => toggleDropdown('user')}
                  aria-haspopup="menu"
                  aria-expanded={activeDropdown === 'user'}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-[#14213D] dark:text-white hover:bg-[#D4A84F]/10 dark:hover:bg-white/10 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-[#D4A84F] flex items-center justify-center text-[#14213D] text-xs font-bold shadow-sm">
                    {user?.profile?.firstName?.[0] || user?.email?.[0]?.toUpperCase()}
                  </div>
                  <span className="max-w-20 truncate">{user?.profile?.firstName || user?.email}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'user' ? 'rotate-180 text-[#D4A84F]' : ''}`} />
                </button>
                <div className={`absolute top-full right-0 mt-1 w-48 bg-[#FAF8F2] dark:bg-[#14213D] rounded-xl shadow-2xl border border-[#D4A84F]/30 dark:border-white/10 overflow-hidden transition-all duration-200 ${activeDropdown === 'user' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                  <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#14213D] dark:text-white/85 hover:text-[#D4A84F] hover:bg-[#D4A84F]/10 dark:hover:bg-white/5 transition-colors" onClick={() => setActiveDropdown(null)}>
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link to="/dashboard/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#14213D] dark:text-white/85 hover:text-[#D4A84F] hover:bg-[#D4A84F]/10 dark:hover:bg-white/5 transition-colors" onClick={() => setActiveDropdown(null)}>
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <hr className="my-1 border-gray-200 dark:border-white/10" />
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                    <LogOut className="w-4 h-4" /> Log out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 text-[#14213D] dark:text-white hover:text-[#D4A84F] dark:hover:text-[#D4A84F] border border-[#14213D]/25 dark:border-white/25 hover:border-[#D4A84F]"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link to="/register" className="btn-secondary text-sm px-5 py-2">
                  Join Us
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Controls: Quick Toggle + Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle className="scale-90" />

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-[#14213D] dark:text-white hover:bg-[#D4A84F]/10 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        } bg-[#FAF8F2] dark:bg-[#14213D] border-t border-[#D4A84F]/40 dark:border-white/10 shadow-2xl text-[#14213D] dark:text-white`}
      >
        <div className="container-custom py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const ItemIcon = NAV_ICONS[item.label];

            return item.children ? (
              <div key={item.label}>
                <button
                  onClick={() => toggleDropdown(item.label)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-[#14213D] dark:text-white/85 hover:text-[#D4A84F] hover:bg-[#D4A84F]/10 dark:hover:bg-white/5 rounded-xl transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    {ItemIcon && <ItemIcon className="w-4 h-4 text-[#D4A84F] shrink-0" />}
                    <span>{item.label}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      activeDropdown === item.label ? 'rotate-180 text-[#D4A84F]' : ''
                    }`}
                  />
                </button>
                {activeDropdown === item.label && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-[#D4A84F]/30 pl-3">
                    {item.children.map((child) =>
                      child.external ? (
                        <a
                          key={child.label}
                          href={child.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-3 py-2 text-sm text-gray-600 dark:text-white/75 hover:text-[#D4A84F] rounded-lg transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {child.label}
                        </a>
                      ) : (
                        <Link
                          key={child.label}
                          to={child.path}
                          className="block px-3 py-2 text-sm text-gray-600 dark:text-white/75 hover:text-[#D4A84F] rounded-lg transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {child.label}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                    isActive
                      ? 'text-[#D4A84F] bg-[#D4A84F]/15 font-semibold'
                      : 'text-[#14213D] dark:text-white/85 hover:text-[#D4A84F] hover:bg-[#D4A84F]/10 dark:hover:bg-white/5'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {ItemIcon && <ItemIcon className="w-4 h-4 text-[#D4A84F] shrink-0" />}
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* Theme row in Mobile Menu */}
          <div className="py-2 px-1">
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#14213D]/5 dark:bg-white/5 border border-[#14213D]/10 dark:border-white/10">
              <div className="flex items-center gap-2.5 text-sm font-medium text-[#14213D] dark:text-white/80">
                {isDark ? (
                  <Moon className="w-4 h-4 text-[#D4A84F]" />
                ) : (
                  <Sun className="w-4 h-4 text-[#D4A84F]" />
                )}
                <span>Theme: {isDark ? 'Dark Mode' : 'Light Mode'}</span>
              </div>
              <ThemeToggle />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200 dark:border-white/10 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#14213D] dark:text-white/85 hover:text-[#D4A84F] hover:bg-[#D4A84F]/10 dark:hover:bg-white/5 rounded-xl"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl"
                >
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block w-full text-center px-4 py-3 text-sm font-medium text-[#14213D] dark:text-white border border-[#14213D]/20 dark:border-white/20 rounded-xl hover:border-[#D4A84F] hover:text-[#D4A84F] transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-secondary w-full justify-center"
                  onClick={() => setIsOpen(false)}
                >
                  Join RCN
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
