import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AppShell from './components/AppShell';
import ProtectedRoute, { PublicOnlyRoute } from './components/ProtectedRoute';

// Pages
import BeforeLoginHome from './pages/BeforeLoginHome';
import Dashboard from './pages/Dashboard';
import ExploreSkills from './pages/ExploreSkills';
import Profile from './pages/Profile';
import Requests from './pages/Requests';
import Projects from './pages/Projects';
import Notifications from './pages/Notifications';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <AppShell>
            <Routes>
              {/* Before-Login Home UI (No sidebar, no content leak; redirects to /dashboard if logged in) */}
              <Route path="/" element={<BeforeLoginHome />} />

              {/* Public Auth Routes */}
              <Route
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <BeforeLoginHome />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicOnlyRoute>
                    <BeforeLoginHome />
                  </PublicOnlyRoute>
                }
              />

              {/* Protected Routes (Visible ONLY after login) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/skills"
                element={
                  <ProtectedRoute>
                    <ExploreSkills />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <Projects />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:id"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/requests"
                element={
                  <ProtectedRoute>
                    <Requests />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect to / */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppShell>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
