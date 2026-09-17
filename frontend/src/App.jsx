import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CandidateLogin from "./pages/CandidateLogin";
import RecruiterLogin from "./pages/RecruiterLogin";
import CandidateDashboard from "./pages/CandidateDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import CandidateRegister from "./pages/CandidateRegister";
import RecruiterRegister from "./pages/RecruiterRegister";
import CandidateProfile from "./pages/CandidateProfile";
import RecruiterProfile from "./pages/RecruiterProfile";
import JobDetails from "./pages/JobDetails";
import MyApplications from "./pages/MyApplications";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <ToastProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/candidate-login"
            element={<CandidateLogin />}
          />

          <Route
            path="/recruiter-login"
            element={<RecruiterLogin />}
          />

          <Route
            path="/register/candidate"
            element={<CandidateRegister />}
          />

          <Route
            path="/register/recruiter"
            element={<RecruiterRegister />}
          />

          <Route
            path="/candidate"
            element={
              <ProtectedRoute role="CANDIDATE">
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/profile"
            element={
              <ProtectedRoute role="CANDIDATE">
                <CandidateProfile />
              </ProtectedRoute>
            }
          />
          <Route
  path="/candidate/applications"
  element={
    <ProtectedRoute role="CANDIDATE">
      <MyApplications />
    </ProtectedRoute>
  }
/>

          <Route
            path="/jobs/:id"
            element={
              <ProtectedRoute role="CANDIDATE">
                <JobDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter"
            element={
              <ProtectedRoute role="RECRUITER">
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/profile"
            element={
              <ProtectedRoute role="RECRUITER">
                <RecruiterProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ToastProvider>
  );
}

export default App;