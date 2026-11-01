// Mock data for development use before backend integration
// All mock data follows the API response structure: { success, message, data, pagination }

// ─── Mock Users / Auth ────────────────────────────────────────────────────

export const mockUsers = [
  {
    id: 'usr-001',
    email: 'admin@church.org',
    role: 'SUPER_ADMIN',
    isActive: true,
    isEmailVerified: true,
    profile: {
      id: 'prof-001',
      firstName: 'Apostolic',
      lastName: 'SuperAdmin',
      phone: '+234-800-000-0001',
      gender: 'MALE',
      avatarUrl: null,
    },
  },
  {
    id: 'usr-002',
    email: 'pastor@church.org',
    role: 'PASTOR',
    isActive: true,
    isEmailVerified: true,
    profile: {
      id: 'prof-002',
      firstName: 'Pastor',
      lastName: 'Arome',
      phone: '+234-800-000-0002',
      gender: 'MALE',
      avatarUrl: null,
    },
  },
  {
    id: 'usr-003',
    email: 'operations@church.org',
    role: 'ADMIN',
    isActive: true,
    isEmailVerified: true,
    profile: {
      id: 'prof-003',
      firstName: 'Operations',
      lastName: 'Admin',
      phone: '+234-800-000-0003',
      gender: 'FEMALE',
      avatarUrl: null,
    },
  },
  {
    id: 'usr-004',
    email: 'depthead@church.org',
    role: 'DEPARTMENT_HEAD',
    isActive: true,
    isEmailVerified: true,
    profile: {
      id: 'prof-004',
      firstName: 'David',
      lastName: 'Okonkwo',
      phone: '+234-800-000-0004',
      gender: 'MALE',
      avatarUrl: null,
    },
  },
  {
    id: 'usr-005',
    email: 'worker@church.org',
    role: 'WORKER',
    isActive: true,
    isEmailVerified: true,
    profile: {
      id: 'prof-005',
      firstName: 'Grace',
      lastName: 'Bello',
      phone: '+234-800-000-0005',
      gender: 'FEMALE',
      avatarUrl: null,
    },
  },
  {
    id: 'usr-006',
    email: 'alice@church.org',
    role: 'MEMBER',
    isActive: true,
    isEmailVerified: true,
    profile: {
      id: 'prof-006',
      firstName: 'Alice',
      lastName: 'Johnson',
      phone: '+234-800-000-0006',
      gender: 'FEMALE',
      avatarUrl: null,
    },
  },
];

// ─── Mock Events ──────────────────────────────────────────────────────────

export const mockEvents = [
  {
    id: 'evt-001',
    title: 'Kingdom Come Conference 2025',
    description: 'Annual kingdom conference with teachings from Dr. Arome Osaghae and guest ministers from across the globe.',
    startDate: '2025-01-15T09:00:00Z',
    endDate: '2025-01-18T21:00:00Z',
    location: 'RCN International Centre, Abuja',
    status: 'PUBLISHED',
    imageUrl: '/conference-bg.jpg',
    category: 'CONFERENCE',
  },
  {
    id: 'evt-002',
    title: 'IEC 2025 — International Evangelism Conference',
    description: 'A gathering of believers for evangelism training, prayer and awakening for the nations.',
    startDate: '2025-02-20T08:00:00Z',
    endDate: '2025-02-23T18:00:00Z',
    location: 'National Stadium, Abuja',
    status: 'PUBLISHED',
    imageUrl: '/hero-bg.jpg',
    category: 'CONFERENCE',
  },
  {
    id: 'evt-003',
    title: 'Eaglets Conference 2025',
    description: 'A youth-focused conference for young believers and students.',
    startDate: '2025-03-10T09:00:00Z',
    endDate: '2025-03-12T17:00:00Z',
    location: 'RCN Headquarters, Makurdi',
    status: 'PUBLISHED',
    imageUrl: '/community-bg.jpg',
    category: 'YOUTH',
  },
  {
    id: 'evt-004',
    title: 'Festival of Glory 2025',
    description: 'A night of praise, worship and thanksgiving to God for His faithfulness.',
    startDate: '2025-04-05T18:00:00Z',
    endDate: '2025-04-05T23:00:00Z',
    location: 'Eagle Square, Abuja',
    status: 'PUBLISHED',
    imageUrl: '/conference-bg.jpg',
    category: 'WORSHIP',
  },
  {
    id: 'evt-005',
    title: 'Lioness Conference 2025',
    description: 'A powerful gathering for women in ministry and the marketplace.',
    startDate: '2025-05-08T09:00:00Z',
    endDate: '2025-05-10T18:00:00Z',
    location: 'RCN International Centre, Abuja',
    status: 'PUBLISHED',
    imageUrl: '/prayer-bg.jpg',
    category: 'WOMEN',
  },
  {
    id: 'evt-006',
    title: 'Ministers Conference 2025',
    description: 'Exclusive gathering for pastors and ministers in the RCN network.',
    startDate: '2025-06-15T08:00:00Z',
    endDate: '2025-06-17T17:00:00Z',
    location: 'RCN Headquarters, Makurdi',
    status: 'PUBLISHED',
    imageUrl: '/sermon-bg.jpg',
    category: 'MINISTERS',
  },
];

// ─── Mock Announcements ───────────────────────────────────────────────────

export const mockAnnouncements = [
  {
    id: 'ann-001',
    title: 'Weekly Prayer Meeting Update',
    content: 'Our weekly prayer meeting holds every Wednesday from 6:00 PM at the main auditorium. All members are encouraged to attend.',
    publishedAt: '2025-01-10T08:00:00Z',
    priority: 'HIGH',
    category: 'PRAYER',
  },
  {
    id: 'ann-002',
    title: 'New Members Orientation',
    content: 'New members orientation is scheduled for the last Saturday of every month. If you recently joined the church, please register through the E-Church portal.',
    publishedAt: '2025-01-08T08:00:00Z',
    priority: 'MEDIUM',
    category: 'MEMBERSHIP',
  },
  {
    id: 'ann-003',
    title: 'Sunday Service Times',
    content: 'First service: 8:00 AM | Second service: 10:30 AM | Third service: 1:00 PM. Children\'s church runs concurrently with all services.',
    publishedAt: '2025-01-05T08:00:00Z',
    priority: 'LOW',
    category: 'SERVICE',
  },
  {
    id: 'ann-004',
    title: 'RCN App Now Available',
    content: 'Download the RCN mobile application from the Google Play Store or Apple App Store to access sermons, events, and more.',
    publishedAt: '2025-01-03T08:00:00Z',
    priority: 'MEDIUM',
    category: 'TECHNOLOGY',
  },
];

// ─── Mock Sermons ─────────────────────────────────────────────────────────

export const mockSermons = [
  {
    id: 'ser-001',
    title: 'The Mystery of the Kingdom',
    speaker: 'Dr. Arome Osaghae',
    series: 'Kingdom Mysteries',
    preachedAt: '2025-01-05T10:00:00Z',
    duration: 5400,
    audioUrl: '#',
    videoUrl: 'https://www.youtube.com/embed/placeholder',
    thumbnailUrl: '/sermon-bg.jpg',
    description: 'A deep exploration into the hidden treasures of the Kingdom of God.',
    tags: ['Kingdom', 'Apostolic', 'Prayer'],
    status: 'PUBLISHED',
    hasTranscript: true,
  },
  {
    id: 'ser-002',
    title: 'Apostolic Order in the Church',
    speaker: 'Dr. Arome Osaghae',
    series: 'Apostolic Christianity',
    preachedAt: '2024-12-29T10:00:00Z',
    duration: 6300,
    audioUrl: '#',
    videoUrl: 'https://www.youtube.com/embed/placeholder',
    thumbnailUrl: '/hero-bg.jpg',
    description: 'Understanding the importance of apostolic order in the modern church.',
    tags: ['Apostolic', 'Church', 'Order'],
    status: 'PUBLISHED',
    hasTranscript: false,
  },
  {
    id: 'ser-003',
    title: 'Prayer — The Heartbeat of Revival',
    speaker: 'Dr. Arome Osaghae',
    series: 'Prayer and Revival',
    preachedAt: '2024-12-22T10:00:00Z',
    duration: 4800,
    audioUrl: '#',
    videoUrl: 'https://www.youtube.com/embed/placeholder',
    thumbnailUrl: '/prayer-bg.jpg',
    description: 'How fervent prayer births true revival in the earth.',
    tags: ['Prayer', 'Revival', 'Kingdom'],
    status: 'PUBLISHED',
    hasTranscript: true,
  },
  {
    id: 'ser-004',
    title: 'The Coming of the King',
    speaker: 'Dr. Arome Osaghae',
    series: 'End Times',
    preachedAt: '2024-12-15T10:00:00Z',
    duration: 7200,
    audioUrl: '#',
    videoUrl: 'https://www.youtube.com/embed/placeholder',
    thumbnailUrl: '/community-bg.jpg',
    description: 'Preparing the church for the glorious return of Jesus Christ.',
    tags: ['Eschatology', 'Return of Christ', 'Preparation'],
    status: 'PUBLISHED',
    hasTranscript: false,
  },
  {
    id: 'ser-005',
    title: 'Breaking of Bread — The Power of Communion',
    speaker: 'Dr. Arome Osaghae',
    series: 'Sacraments',
    preachedAt: '2024-12-08T10:00:00Z',
    duration: 5100,
    audioUrl: '#',
    videoUrl: 'https://www.youtube.com/embed/placeholder',
    thumbnailUrl: '/sermon-bg.jpg',
    description: 'Rediscovering the profound significance of Holy Communion.',
    tags: ['Communion', 'Sacrament', 'Presence'],
    status: 'PUBLISHED',
    hasTranscript: true,
  },
  {
    id: 'ser-006',
    title: 'The Remnant in the Last Days',
    speaker: 'Dr. Arome Osaghae',
    series: 'End Times',
    preachedAt: '2024-12-01T10:00:00Z',
    duration: 6600,
    audioUrl: '#',
    videoUrl: 'https://www.youtube.com/embed/placeholder',
    thumbnailUrl: '/conference-bg.jpg',
    description: 'God\'s strategy for preserving a holy people in the end times.',
    tags: ['Remnant', 'Holiness', 'End Times'],
    status: 'PUBLISHED',
    hasTranscript: false,
  },
];

// ─── Mock Departments ─────────────────────────────────────────────────────

export const mockDepartments = [
  { id: 'dep-001', name: 'Worship & Arts', description: 'Coordinates all worship and creative arts ministry', isActive: true, memberCount: 45 },
  { id: 'dep-002', name: 'Prayer Ministry', description: 'Organizes corporate and intercessory prayer', isActive: true, memberCount: 62 },
  { id: 'dep-003', name: 'Evangelism', description: 'Outreach and evangelism activities', isActive: true, memberCount: 38 },
  { id: 'dep-004', name: 'Ushering', description: 'Service coordination and hospitality', isActive: true, memberCount: 55 },
  { id: 'dep-005', name: 'Media & Technology', description: 'Audio/visual, broadcasting and digital media', isActive: true, memberCount: 28 },
  { id: 'dep-006', name: 'Children Ministry', description: 'Ministry to children and youth', isActive: true, memberCount: 32 },
];

// ─── Mock Members ─────────────────────────────────────────────────────────

export const mockMembers = Array.from({ length: 32 }, (_, i) => ({
  id: `mem-${String(i + 1).padStart(3, '0')}`,
  memberNumber: `RCN${String(i + 1).padStart(4, '0')}`,
  status: i % 8 === 0 ? 'VISITOR' : i % 12 === 0 ? 'INACTIVE' : 'ACTIVE',
  joinedDate: new Date(Date.now() - (i * 18 + 10) * 24 * 3600 * 1000).toISOString(),
  profile: {
    firstName: ['James', 'Mary', 'John', 'Sarah', 'David', 'Grace', 'Daniel', 'Faith', 'Samuel', 'Joy'][i % 10],
    lastName: ['Okafor', 'Adeyemi', 'Ibrahim', 'Nwankwo', 'Aliyu', 'Okonkwo', 'Bello', 'Chukwu', 'Eze', 'Musa'][i % 10],
    phone: `+234-800-000-${String(i + 10).padStart(4, '0')}`,
    gender: i % 2 === 0 ? 'MALE' : 'FEMALE',
    avatarUrl: null,
  },
  department: mockDepartments[i % mockDepartments.length],
}));

// ─── Mock Donations ───────────────────────────────────────────────────────

export const mockDonations = Array.from({ length: 16 }, (_, i) => ({
  id: `don-${String(i + 1).padStart(3, '0')}`,
  amount: [2500, 5000, 10000, 25000, 50000, 100000, 150000][i % 7],
  currency: 'NGN',
  purpose: ['Tithe', 'Offering', 'Building Fund', 'Missions', 'Conference', 'Welfare'][i % 6],
  status: 'COMPLETED',
  createdAt: new Date(Date.now() - i * 4 * 24 * 3600 * 1000).toISOString(),
  donor: { name: ['Anonymous Partner', 'David O.', 'Grace B.', 'Kingdom Builder', 'Emmanuel N.'][i % 5] },
}));

// ─── Mock Rosters ─────────────────────────────────────────────────────────

export const mockRosters = [
  {
    id: 'ros-001',
    serviceDate: '2025-01-12T08:00:00Z',
    department: mockDepartments[0],
    workers: mockMembers.slice(0, 5),
    notes: 'Regular Sunday service roster',
  },
  {
    id: 'ros-002',
    serviceDate: '2025-01-19T08:00:00Z',
    department: mockDepartments[1],
    workers: mockMembers.slice(5, 10),
    notes: 'Prayer service roster',
  },
  {
    id: 'ros-003',
    serviceDate: '2025-01-26T08:00:00Z',
    department: mockDepartments[3],
    workers: mockMembers.slice(10, 15),
    notes: 'Ushering and hospitality service roster',
  },
];

// ─── Mock First Timers ────────────────────────────────────────────────────

export const mockFirstTimers = Array.from({ length: 12 }, (_, i) => ({
  id: `ft-${String(i + 1).padStart(3, '0')}`,
  firstName: ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'James', 'Lucas', 'Mia', 'Benjamin', 'Amara'][i],
  lastName: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Taylor', 'Wilson', 'Anderson', 'Obi'][i],
  phone: `+234-800-111-${String(i + 100).padStart(4, '0')}`,
  email: `visitor${i + 1}@example.com`,
  address: 'Awka, Anambra State',
  visitDate: new Date(Date.now() - i * 2.5 * 24 * 3600 * 1000).toISOString(),
  followUpStatus: ['PENDING', 'CONTACTED', 'COMPLETED'][i % 3],
  notes: i % 2 === 0 ? 'Visited during Sunday 1st Service' : 'Joined through Mid-week Prayer Altar',
}));

// ─── Mock Prayer Requests ─────────────────────────────────────────────────

export const mockPrayerRequests = [
  {
    id: 'pr-001',
    name: 'Sister Blessing A.',
    title: 'Divine Healing & Restoration',
    category: 'Healing',
    status: 'ANSWERED',
    submittedAt: '2025-01-12T14:30:00Z',
    isConfidential: false,
  },
  {
    id: 'pr-002',
    name: 'Brother Chukwuma E.',
    title: 'Apostolic Open Doors for Mission',
    category: 'Ministry',
    status: 'INTERCESSION',
    submittedAt: '2025-01-11T19:00:00Z',
    isConfidential: true,
  },
  {
    id: 'pr-003',
    name: 'Family of Elder Okoye',
    title: 'Spiritual Breakthrough & Deliverance',
    category: 'Family',
    status: 'NEW',
    submittedAt: '2025-01-10T10:15:00Z',
    isConfidential: false,
  },
  {
    id: 'pr-004',
    name: 'Kelechi M.',
    title: 'Career Advancement & Relocation',
    category: 'Career',
    status: 'FOLLOW_UP',
    submittedAt: '2025-01-09T16:40:00Z',
    isConfidential: false,
  },
  {
    id: 'pr-005',
    name: 'Ngozi D.',
    title: 'Fruit of the Womb Testimonies',
    category: 'Thanksgiving',
    status: 'ANSWERED',
    submittedAt: '2025-01-07T08:20:00Z',
    isConfidential: false,
  },
];

// ─── Mock Administrative Audit Logs ───────────────────────────────────────

export const mockAuditLogs = [
  {
    id: 'log-001',
    user: 'Operations Admin',
    action: 'New Member Verified',
    target: 'RCN0032 (Amara Obi)',
    ip: '102.89.44.12',
    timestamp: '2025-01-13T10:14:00Z',
    status: 'SUCCESS',
  },
  {
    id: 'log-002',
    user: 'Pastor Arome',
    action: 'Sermon Published',
    target: 'The Mystery of the Kingdom',
    ip: '197.210.55.8',
    timestamp: '2025-01-12T18:45:00Z',
    status: 'SUCCESS',
  },
  {
    id: 'log-003',
    user: 'Apostolic SuperAdmin',
    action: 'User Role Promotion',
    target: 'David Okonkwo -> DEPARTMENT_HEAD',
    ip: '105.112.23.90',
    timestamp: '2025-01-11T12:00:00Z',
    status: 'SUCCESS',
  },
  {
    id: 'log-004',
    user: 'Operations Admin',
    action: 'Bulk Attendance Committed',
    target: 'Sunday 1st & 2nd Service (421 attendees)',
    ip: '102.89.44.12',
    timestamp: '2025-01-10T13:30:00Z',
    status: 'SUCCESS',
  },
  {
    id: 'log-005',
    user: 'System Worker',
    action: 'Database Automated Backup',
    target: 'rcn_prod_db_2025_01.sql',
    ip: '127.0.0.1',
    timestamp: '2025-01-09T03:00:00Z',
    status: 'SUCCESS',
  },
];

// ─── Mock System Health Indicators ────────────────────────────────────────

export const mockSystemHealth = {
  apiStatus: 'Operational',
  uptime: '99.98%',
  databaseStatus: 'Connected',
  dbLatency: '18ms',
  storageUsed: '42.8 GB / 100 GB',
  activeConnections: 148,
  version: 'v2.4.0-apostolic',
};

// ─── Mock Attendance ──────────────────────────────────────────────────────

export const mockAttendanceSummary = {
  totalSessions: 52,
  avgAttendance: 380,
  weeklyBreakdown: [
    { week: 'Week 1', count: 342, date: '01 Dec' },
    { week: 'Week 2', count: 389, date: '08 Dec' },
    { week: 'Week 3', count: 415, date: '15 Dec' },
    { week: 'Week 4', count: 398, date: '22 Dec' },
    { week: 'Week 5', count: 421, date: '29 Dec' },
    { week: 'Week 6', count: 448, date: '05 Jan' },
    { week: 'Week 7', count: 462, date: '12 Jan' },
  ],
  monthlyBreakdown: [
    { month: 'Aug', count: 1420 },
    { month: 'Sep', count: 1510 },
    { month: 'Oct', count: 1640 },
    { month: 'Nov', count: 1720 },
    { month: 'Dec', count: 1910 },
    { month: 'Jan', count: 2050 },
  ],
  byDepartment: mockDepartments.map((d, i) => ({
    department: d.name,
    count: 30 + i * 8,
  })),
};

// Helper to simulate API delay
export const delay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Paginate mock data
export const paginateMock = (data, page = 1, limit = 12) => {
  const total = data.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const items = data.slice(start, start + limit);
  return {
    success: true,
    data: items,
    pagination: { total, page, limit, totalPages },
  };
};
