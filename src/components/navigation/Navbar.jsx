import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu, X, ChevronDown, LogIn, LogOut, User, LayoutDashboard,
  Flame, Sun, Moon, Home, Church, BookOpen, CalendarDays, HeartHandshake
} from 'lucide-react';
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? isDark
            ? 'bg-[#09080e]/95 backdrop-blur-md shadow-2xl border-b border-white/10'
            : 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
            <div className="w-10 h-10 rounded-full bg-accent-gradient flex items-center justify-center animate-pulse-glow shrink-0">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <div
                className={`font-display font-bold text-lg leading-tight transition-colors duration-300 ${
                  scrolled
                    ? isDark ? 'text-white' : 'text-primary'
                    : 'text-white'
                }`}
              >
                RCN
              </div>
              <div
                className={`text-xs leading-tight transition-colors duration-300 ${
                  scrolled
                    ? isDark ? 'text-gray-400' : 'text-gray-500'
                    : 'text-white/70'
                }`}
              >
                Remnant Christian Network
              </div>
            </div>
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
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      scrolled
                        ? isDark
                          ? 'text-gray-200 hover:text-accent hover:bg-white/5'
                          : 'text-gray-700 hover:text-accent hover:bg-accent/5'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {ItemIcon && <ItemIcon className="w-4 h-4 shrink-0" />}
                    <span>{item.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        activeDropdown === item.label ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown */}
                  <div
                    className={`absolute top-full left-0 mt-1 w-52 bg-white dark:bg-[#131122] rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden transition-all duration-200 ${
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
                          className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:text-accent hover:bg-accent/5 dark:hover:bg-white/5 transition-colors"
                        >
                          {child.label}
                        </a>
                      ) : (
                        <Link
                          key={child.label}
                          to={child.path}
                          className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:text-accent hover:bg-accent/5 dark:hover:bg-white/5 transition-colors"
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
                        ? scrolled
                          ? 'text-accent bg-accent/10'
                          : 'text-white bg-white/15'
                        : scrolled
                        ? isDark
                          ? 'text-gray-200 hover:text-accent hover:bg-white/5'
                          : 'text-gray-700 hover:text-accent hover:bg-accent/5'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
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
            {/* Black & White Theme Toggle */}
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => toggleDropdown('user')}
                  aria-haspopup="menu"
                  aria-expanded={activeDropdown === 'user'}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    scrolled
                      ? isDark
                        ? 'text-gray-200 hover:bg-white/10'
                        : 'text-gray-700 hover:bg-gray-100'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-accent-gradient flex items-center justify-center text-white text-xs font-bold">
                    {user?.profile?.firstName?.[0] || user?.email?.[0]?.toUpperCase()}
                  </div>
                  <span className="max-w-20 truncate">{user?.profile?.firstName || user?.email}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'user' ? 'rotate-180' : ''}`} />
                </button>
                <div className={`absolute top-full right-0 mt-1 w-48 bg-white dark:bg-[#131122] rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden transition-all duration-200 ${activeDropdown === 'user' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                  <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:text-accent hover:bg-accent/5 dark:hover:bg-white/5 transition-colors" onClick={() => setActiveDropdown(null)}>
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link to="/dashboard/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:text-accent hover:bg-accent/5 dark:hover:bg-white/5 transition-colors" onClick={() => setActiveDropdown(null)}>
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <hr className="my-1 border-gray-100 dark:border-white/10" />
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                    <LogOut className="w-4 h-4" /> Log out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    scrolled
                      ? isDark
                        ? 'text-gray-200 hover:text-accent border border-neutral-700 hover:border-accent'
                        : 'text-gray-700 hover:text-accent border border-gray-200 hover:border-accent'
                      : 'text-white border border-white/30 hover:bg-white/10'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm px-5 py-2">
                  Join Us
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Controls: Quick Toggle + Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Quick theme toggle for mobile header */}
            <ThemeToggle className="scale-90" />

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors ${
                scrolled
                  ? isDark
                    ? 'text-gray-200 hover:bg-white/10'
                    : 'text-gray-700 hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer — always shows full text for usability */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        } bg-white dark:bg-[#0e0d19] border-t border-gray-100 dark:border-white/10 shadow-xl`}
      >
        <div className="container-custom py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const ItemIcon = NAV_ICONS[item.label];

            return item.children ? (
              <div key={item.label}>
                <button
                  onClick={() => toggleDropdown(item.label)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-accent hover:bg-accent/5 dark:hover:bg-white/5 rounded-xl transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    {ItemIcon && <ItemIcon className="w-4 h-4 text-accent shrink-0" />}
                    <span>{item.label}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      activeDropdown === item.label ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeDropdown === item.label && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-accent/20 pl-3">
                    {item.children.map((child) =>
                      child.external ? (
                        <a
                          key={child.label}
                          href={child.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-accent rounded-lg transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {child.label}
                        </a>
                      ) : (
                        <Link
                          key={child.label}
                          to={child.path}
                          className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-accent rounded-lg transition-colors"
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
                      ? 'text-accent bg-accent/10'
                      : 'text-gray-700 dark:text-gray-200 hover:text-accent hover:bg-accent/5 dark:hover:bg-white/5'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {ItemIcon && <ItemIcon className="w-4 h-4 text-accent shrink-0" />}
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* Theme row in Mobile Menu for clear discoverability */}
          <div className="py-2 px-1">
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
              <div className="flex items-center gap-2.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                {isDark ? (
                  <Moon className="w-4 h-4 text-accent" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
                <span>Theme: {isDark ? 'Dark Mode' : 'Light Mode'}</span>
              </div>
              <ThemeToggle />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-white/10 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-accent hover:bg-accent/5 dark:hover:bg-white/5 rounded-xl"
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
                  className="block w-full text-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/20 rounded-xl hover:border-accent hover:text-accent transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary w-full justify-center"
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
