// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
export const APP_NAME = 'Remnant Christian Network';
export const APP_SHORT_NAME = 'RCN';
export const APP_TAGLINE = 'Striving toward the rebirth of Apostolic Christianity';

// Roles hierarchy
export const ROLES = {
  MEMBER: 'MEMBER',
  WORKER: 'WORKER',
  DEPARTMENT_HEAD: 'DEPARTMENT_HEAD',
  PASTOR: 'PASTOR',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
};

// Role hierarchy order (ascending privilege)
export const ROLE_HIERARCHY = [
  ROLES.MEMBER,
  ROLES.WORKER,
  ROLES.DEPARTMENT_HEAD,
  ROLES.PASTOR,
  ROLES.ADMIN,
  ROLES.SUPER_ADMIN,
];

// Check if a user's role meets the minimum required role
export const hasMinRole = (userRole, minRole) => {
  const userLevel = ROLE_HIERARCHY.indexOf(userRole);
  const minLevel = ROLE_HIERARCHY.indexOf(minRole);
  return userLevel >= minLevel;
};

// Token storage keys
export const TOKEN_KEYS = {
  ACCESS: 'rcn_access_token',
  REFRESH: 'rcn_refresh_token',
  USER: 'rcn_user',
};

// Navigation items
export const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  {
    label: 'Resources',
    path: '#',
    children: [
      { label: "Dr. Arome's Titles", path: '/resources/books' },
      { label: 'RCN Centers', path: '/resources/centers' },
      { label: 'Adullam Seminary', path: 'https://www.adullam.ng', external: true },
    ],
  },
  {
    label: 'E-Church',
    path: '#',
    children: [
      { label: 'Prayer Request', path: '/prayer' },
      { label: 'Share Testimony', path: '/testimony' },
      { label: 'Membership Registration', path: '/register' },
    ],
  },
  {
    label: 'Conferences',
    path: '#',
    children: [
      { label: 'IEC', path: '/conferences/iec' },
      { label: 'Eaglets Conference', path: '/conferences/eaglets' },
      { label: 'Lioness Conference', path: '/conferences/lioness' },
      { label: 'Ministers Conference', path: '/conferences/ministers' },
      { label: 'Festival of Glory', path: '/conferences/fog' },
    ],
  },
  { label: 'Sermons', path: '/sermons' },
  { label: 'Events', path: '/events' },
  { label: 'Give', path: '/give' },
];

// Event status labels
export const EVENT_STATUS = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  CANCELLED: 'Cancelled',
  ARCHIVED: 'Archived',
};

// Member status labels
export const MEMBER_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  VISITOR: 'Visitor',
  TRANSFERRED: 'Transferred',
};

// Gender options
export const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
];

// Donation amounts (in NGN)
export const DONATION_PRESETS = [1000, 2500, 5000, 10000, 25000, 50000];

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 12;

// Social links
export const SOCIAL_LINKS = {
  youtube: 'https://www.youtube.com/@RemnantChristianNetwork',
  facebook: 'https://www.facebook.com/rcnglobal',
  instagram: 'https://www.instagram.com/rcnglobal',
  telegram: 'https://t.me/rcnglobal',
};
