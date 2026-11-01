import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SermonsPage from './pages/SermonsPage';
import SermonDetailPage from './pages/SermonDetailPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import GivePage from './pages/GivePage';
import PrayerPage from './pages/PrayerPage';
import TestimonyPage from './pages/TestimonyPage';
import NotFoundPage from './pages/NotFoundPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Dashboard Layout & Pages
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import ProfilePage from './pages/dashboard/ProfilePage';
import MembersPage from './pages/dashboard/MembersPage';
import AttendancePage from './pages/dashboard/AttendancePage';
import FirstTimersPage from './pages/dashboard/FirstTimersPage';
import RostersPage from './pages/dashboard/RostersPage';
import DepartmentsPage from './pages/dashboard/DepartmentsPage';
import AdminEventsPage from './pages/dashboard/AdminEventsPage';
import AnnouncementsAdminPage from './pages/dashboard/AnnouncementsAdminPage';
import AdminSermonsPage from './pages/dashboard/AdminSermonsPage';
import DonationsAdminPage from './pages/dashboard/DonationsAdminPage';
import RoleManagementPage from './pages/dashboard/RoleManagementPage';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* ── Public Routes ─────────────────────────────── */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/sermons" element={<SermonsPage />} />
            <Route path="/sermons/:id" element={<SermonDetailPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/give" element={<GivePage />} />
            <Route path="/prayer" element={<PrayerPage />} />
            <Route path="/testimony" element={<TestimonyPage />} />

            {/* Conference sub-pages (reuse Events) */}
            <Route path="/conferences/iec" element={<EventsPage />} />
            <Route path="/conferences/eaglets" element={<EventsPage />} />
            <Route path="/conferences/lioness" element={<EventsPage />} />
            <Route path="/conferences/ministers" element={<EventsPage />} />
            <Route path="/conferences/fog" element={<EventsPage />} />

            {/* Resource sub-pages */}
            <Route path="/resources/books" element={<AboutPage />} />
            <Route path="/resources/centers" element={<AboutPage />} />

            {/* ── Auth Routes ────────────────────────────────── */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* ── Protected Dashboard Routes ─────────────────── */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Index → Dashboard Home */}
              <Route index element={<DashboardHome />} />

              {/* Profile — all roles */}
              <Route path="profile" element={<ProfilePage />} />

              {/* Worker+ routes */}
              <Route
                path="members"
                element={
                  <ProtectedRoute minRole="WORKER">
                    <MembersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="attendance"
                element={
                  <ProtectedRoute minRole="WORKER">
                    <AttendancePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="first-timers"
                element={
                  <ProtectedRoute minRole="WORKER">
                    <FirstTimersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="rosters"
                element={
                  <ProtectedRoute minRole="WORKER">
                    <RostersPage />
                  </ProtectedRoute>
                }
              />

              {/* Dept Head+ routes */}
              <Route
                path="departments"
                element={
                  <ProtectedRoute minRole="DEPARTMENT_HEAD">
                    <DepartmentsPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin+ routes */}
              <Route
                path="events"
                element={
                  <ProtectedRoute minRole="ADMIN">
                    <AdminEventsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="announcements"
                element={
                  <ProtectedRoute minRole="ADMIN">
                    <AnnouncementsAdminPage />
                  </ProtectedRoute>
                }
              />

              {/* Pastor+ routes */}
              <Route
                path="sermons"
                element={
                  <ProtectedRoute minRole="PASTOR">
                    <AdminSermonsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="donations"
                element={
                  <ProtectedRoute minRole="PASTOR">
                    <DonationsAdminPage />
                  </ProtectedRoute>
                }
              />

              {/* Super Admin routes */}
              <Route
                path="roles"
                element={
                  <ProtectedRoute minRole="SUPER_ADMIN">
                    <RoleManagementPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* ── Fallbacks ──────────────────────────────────── */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
