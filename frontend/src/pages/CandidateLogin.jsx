import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

function CandidateLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await api.login(email, password);

      if (data.role !== "CANDIDATE") {
        setError("This account is not a candidate account.");
        return;
      }

      login(data);
      navigate("/candidate");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual candidate-visual">
        <div className="auth-visual-content">
          <div className="auth-logo" onClick={() => navigate("/")}>
            <div className="auth-logo-mark">J</div>
            <span>JobHub</span>
          </div>

          <div className="auth-visual-text">
            <span className="auth-eyebrow">YOUR CAREER JOURNEY</span>

            <h1>
              Find opportunities.
              <br />
              <span>Build your future.</span>
            </h1>

            <p>
              Discover jobs that match your skills, connect with companies,
              and take the next step in your career.
            </p>
          </div>

          <div className="auth-feature-card">
            <div className="auth-feature-icon">✓</div>
            <div>
              <strong>Thousands of opportunities</strong>
              <span>Find your next career move</span>
            </div>
          </div>
        </div>

        <div className="auth-decoration auth-decoration-one"></div>
        <div className="auth-decoration auth-decoration-two"></div>
      </div>

      <div className="auth-form-section">
        <div className="auth-form-container">
          <button
            className="auth-back"
            onClick={() => navigate("/")}
          >
            ← Back to home
          </button>

          <div className="mobile-auth-logo">
            <div className="auth-logo-mark">J</div>
            <span>JobHub</span>
          </div>

          <div className="auth-heading">
            <span className="auth-label">CANDIDATE ACCOUNT</span>

            <h2>Welcome back</h2>

            <p>
              Sign in to continue your job search.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-input-group">
              <label>Email address</label>

              <div className="auth-input-wrapper">
                <span>✉</span>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <div className="auth-label-row">
                <label>Password</label>
              </div>

              <div className="auth-input-wrapper">
                <span>🔒</span>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="auth-error">
                <span>!</span>
                {error}
              </div>
            )}

            <button className="auth-submit" type="submit">
              Sign in as Candidate
              <span>→</span>
            </button>
          </form>

          <div className="auth-register">
            <span>Don't have a candidate account?</span>

            <button
              onClick={() => navigate("/register/candidate")}
            >
              Create an account
            </button>
          </div>

          <div className="auth-switch">
            <span>Are you hiring?</span>

            <button
              onClick={() => navigate("/recruiter-login")}
            >
              Recruiter Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateLogin;