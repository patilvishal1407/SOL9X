import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./components/Login";
import StudentList from "./components/StudentList";
import StudentForm from "./components/StudentForm";
import Analytics from "./components/Analytics";
import Layout from "./components/layout/Layout";
import Signup from "./components/Signup";
import StudentDashboard from "./components/StudentDashboard";
import { ToastProvider } from "./context/ToastContext";

function RoleRedirect() {
  const { user } = React.useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "admin" ? (
    <Navigate to="/students" replace />
  ) : (
    <Navigate to="/dashboard" replace />
  );
}

function ProtectedRoute({ children }) {
  const { token, loading } = React.useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<RoleRedirect />} />
            {/* Admin area */}
            <Route path="students" element={<StudentList />} />
            <Route path="students/new" element={<StudentForm />} />
            <Route path="students/:id" element={<StudentForm />} />
            <Route path="analytics" element={<Analytics />} />
            {/* Student area */}
            <Route path="dashboard" element={<StudentDashboard />} />
          </Route>

            <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
