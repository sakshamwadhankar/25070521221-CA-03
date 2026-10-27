import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AppShell from './components/AppShell';
import ProtectedRoute, { PublicOnlyRoute } from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
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
              {/* 1. Landing Page */}
              <Route path="/" element={<Landing />} />

              {/* 2. Login Page */}
              <Route
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <Login />
                  </PublicOnlyRoute>
                }
              />

              {/* 3. Signup Page */}
              <Route
                path="/signup"
                element={
                  <PublicOnlyRoute>
                    <Signup />
                  </PublicOnlyRoute>
                }
              />

              {/* 4. Dashboard Page (protected) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* 5. Explore Skills Page */}
              <Route path="/skills" element={<ExploreSkills />} />

              {/* 6. Profile Page */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/profile/:id" element={<Profile />} />

              {/* 7. Requests Page (protected) */}
              <Route
                path="/requests"
                element={
                  <ProtectedRoute>
                    <Requests />
                  </ProtectedRoute>
                }
              />

              {/* 8. Projects Page */}
              <Route path="/projects" element={<Projects />} />

              {/* 9. Notifications Page (protected) */}
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect to Landing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppShell>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
