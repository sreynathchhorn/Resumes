import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Welcome from "./pages/Welcome";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Applications from "./pages/Applications";
import MyResume from "./pages/MyResume";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import JobManagement from "./pages/admin/JobManagement";
import ApplicationManagement from "./pages/admin/ApplicationManagement";
import ActivityLog from "./pages/admin/ActivityLog";
import AdminSettings from "./pages/admin/AdminSettings";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* =========================
              PUBLIC ROUTES
          ========================== */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


          {/* =========================
              PROTECTED USER ROUTES
          ========================== */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>

              <Route path="/dashboard" element={<Home />} />

              <Route path="/jobs" element={<Jobs />} />

              <Route path="/applications" element={<Applications />} />

              <Route path="/resume" element={<MyResume />} />

              <Route path="/profile" element={<Profile />} />

              <Route path="/settings" element={<Settings />} />

            </Route>
          </Route>


          {/* =========================
              ADMIN ROUTES
          ========================== */}
          <Route element={<ProtectedRoute admin />}>
            <Route element={<MainLayout />}>

              <Route
                path="/admin"
                element={<AdminDashboard />}
              />

              <Route
                path="/admin/users"
                element={<UsersManagement />}
              />

              <Route
                path="/admin/jobs"
                element={<JobManagement />}
              />

              <Route
                path="/admin/applications"
                element={<ApplicationManagement />}
              />

              <Route
                path="/admin/activity"
                element={<ActivityLog />}
              />

              <Route
                path="/admin/settings"
                element={<AdminSettings />}
              />

            </Route>
          </Route>


          {/* =========================
              UNKNOWN URL
          ========================== */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>
      </Router>
    </AuthProvider>
  );
}