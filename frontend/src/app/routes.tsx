import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Auth from "../pages/Auth";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import Courts from "../pages/Courts";
import Booking from "../pages/Booking";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Notifications from "../pages/Notifications";
import About from "../pages/About";
import TopUp from "../pages/TopUp";
import Help from "../pages/Help";

const getRole = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem("sc_role");
};

const RequireRole = ({ role, children }: { role: "user" | "admin"; children: JSX.Element }) => {
  const location = useLocation();
  const currentRole = getRole();
  if (!currentRole) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  if (currentRole !== role) {
    return <Navigate to={currentRole === "admin" ? "/admin" : "/dashboard"} replace />;
  }
  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/dashboard"
        element={
          <RequireRole role="user">
            <Dashboard />
          </RequireRole>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireRole role="admin">
            <AdminDashboard />
          </RequireRole>
        }
      />
      <Route path="/courts" element={<Courts />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/topup" element={<TopUp />} />
      <Route path="/help" element={<Help />} />
      <Route path="*" element={<Auth />} />
    </Routes>
  );
};
