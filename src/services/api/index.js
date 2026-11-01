import apiClient from './client';

// ─── Auth ──────────────────────────────────────────────────────────────────

export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  refresh: (refreshToken) => apiClient.post('/auth/refresh', { refreshToken }),
  me: () => apiClient.get('/auth/me'),
  verifyEmail: (token) => apiClient.get(`/auth/verify-email?token=${token}`),
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) =>
    apiClient.post('/auth/reset-password', { token, password }),
  changePassword: (data) => apiClient.post('/auth/change-password', data),
};

// ─── Users (Super Admin) ───────────────────────────────────────────────────

export const usersAPI = {
  getUsers: (params) => apiClient.get('/users', { params }),
  getUser: (id) => apiClient.get(`/users/${id}`),
  updateUserRole: (id, role) => apiClient.patch(`/users/${id}/role`, { role }),
  activateUser: (id) => apiClient.patch(`/users/${id}/activate`),
  deactivateUser: (id) => apiClient.patch(`/users/${id}/deactivate`),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),
};

// ─── Profiles ──────────────────────────────────────────────────────────────

export const profilesAPI = {
  getMyProfile: () => apiClient.get('/profiles/me'),
  updateMyProfile: (data) => apiClient.patch('/profiles/me', data),
  getProfile: (id) => apiClient.get(`/profiles/${id}`),
  updateProfile: (id, data) => apiClient.patch(`/profiles/${id}`, data),
  uploadAvatar: (formData) =>
    apiClient.post('/profiles/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// ─── Members ──────────────────────────────────────────────────────────────

export const membersAPI = {
  getMembers: (params) => apiClient.get('/members', { params }),
  createMember: (data) => apiClient.post('/members', data),
  getMember: (id) => apiClient.get(`/members/${id}`),
  updateMember: (id, data) => apiClient.patch(`/members/${id}`, data),
  deleteMember: (id) => apiClient.delete(`/members/${id}`),
};

// ─── Departments ──────────────────────────────────────────────────────────

export const departmentsAPI = {
  getDepartments: (params) => apiClient.get('/departments', { params }),
  createDepartment: (data) => apiClient.post('/departments', data),
  getDepartment: (id) => apiClient.get(`/departments/${id}`),
  updateDepartment: (id, data) => apiClient.patch(`/departments/${id}`, data),
  deleteDepartment: (id) => apiClient.delete(`/departments/${id}`),
  assignMember: (departmentId, data) =>
    apiClient.post(`/departments/${departmentId}/members`, data),
  removeMember: (departmentId, memberId) =>
    apiClient.delete(`/departments/${departmentId}/members/${memberId}`),
};

// ─── Events ───────────────────────────────────────────────────────────────

export const eventsAPI = {
  getEvents: (params) => apiClient.get('/events', { params }),
  createEvent: (data) => apiClient.post('/events', data),
  getEvent: (id) => apiClient.get(`/events/${id}`),
  updateEvent: (id, data) => apiClient.patch(`/events/${id}`, data),
  deleteEvent: (id) => apiClient.delete(`/events/${id}`),
};

// ─── Announcements ────────────────────────────────────────────────────────

export const announcementsAPI = {
  getAnnouncements: (params) => apiClient.get('/announcements', { params }),
  createAnnouncement: (data) => apiClient.post('/announcements', data),
  getAnnouncement: (id) => apiClient.get(`/announcements/${id}`),
  updateAnnouncement: (id, data) => apiClient.patch(`/announcements/${id}`, data),
  deleteAnnouncement: (id) => apiClient.delete(`/announcements/${id}`),
};

// ─── Attendance ───────────────────────────────────────────────────────────

export const attendanceAPI = {
  recordAttendance: (data) => apiClient.post('/attendance', data),
  recordBulkAttendance: (data) => apiClient.post('/attendance/bulk', data),
  getAttendance: (params) => apiClient.get('/attendance', { params }),
  getAttendanceSummary: (params) =>
    apiClient.get('/attendance/summary', { params }),
};

// ─── First Timers ─────────────────────────────────────────────────────────

export const firstTimersAPI = {
  registerFirstTimer: (data) => apiClient.post('/first-timers', data),
  getFirstTimers: (params) => apiClient.get('/first-timers', { params }),
  getFirstTimer: (id) => apiClient.get(`/first-timers/${id}`),
  updateFirstTimer: (id, data) => apiClient.patch(`/first-timers/${id}`, data),
};

// ─── Rosters ──────────────────────────────────────────────────────────────

export const rostersAPI = {
  getRosters: (params) => apiClient.get('/rosters', { params }),
  createRoster: (data) => apiClient.post('/rosters', data),
  getRoster: (id) => apiClient.get(`/rosters/${id}`),
  updateRoster: (id, data) => apiClient.patch(`/rosters/${id}`, data),
  deleteRoster: (id) => apiClient.delete(`/rosters/${id}`),
};

// ─── Sermons ──────────────────────────────────────────────────────────────

export const sermonsAPI = {
  getSermons: (params) => apiClient.get('/sermons', { params }),
  createSermon: (data) => apiClient.post('/sermons', data),
  getSermon: (id) => apiClient.get(`/sermons/${id}`),
  updateSermon: (id, data) => apiClient.patch(`/sermons/${id}`, data),
  deleteSermon: (id) => apiClient.delete(`/sermons/${id}`),
  publishSermon: (id) => apiClient.patch(`/sermons/${id}/publish`),
  unpublishSermon: (id) => apiClient.patch(`/sermons/${id}/unpublish`),
  requestTranscription: (id) => apiClient.post(`/sermons/${id}/transcription-jobs`),
  getTranscript: (id) => apiClient.get(`/sermons/${id}/transcript`),
};

// ─── Donations ────────────────────────────────────────────────────────────

export const donationsAPI = {
  initiateCheckout: (data) => apiClient.post('/donations/checkout', data),
  getDonations: (params) => apiClient.get('/donations', { params }),
  getDonation: (id) => apiClient.get(`/donations/${id}`),
};
