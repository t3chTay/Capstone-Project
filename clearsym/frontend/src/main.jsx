import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

import Landing from "./pages/LandingPage";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Doctor from "./pages/Doctor";
import DoctorDashboard from "./pages/DoctorDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import "./styles.css";
import ParticlesBackground from "./components/ParticleBg";
import Profile from "./pages/Profile";

//  doctor guard
function DoctorRoute({ children }) {
  const doctorCode = localStorage.getItem("clearsym_doctor_code");
  if (!doctorCode) return <Navigate to="/doctor" replace />;
  return children;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <>
      <div className="app-ui">
         <ParticlesBackground />
          <Navbar />
          <Routes>
            
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
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


            {/* doctor mode ( read-only) */}
            <Route path="/doctor" element={<Doctor />} />
            <Route
              path="/doctor/dashboard"
              element={
                <DoctorRoute>
                  <DoctorDashboard />
                </DoctorRoute>
              }
            />
          </Routes>
        </div>
      </>
    </BrowserRouter>
  </React.StrictMode>
);

