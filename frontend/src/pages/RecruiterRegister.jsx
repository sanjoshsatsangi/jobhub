import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

function RecruiterRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.register({
        name,
        email,
        password,
        role: "RECRUITER",
      });

      navigate("/recruiter-login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual recruiter-visual">
        <div className="auth-visual-content">
          <div className="auth-logo" onClick={() => navigate("/")}>
            <div className="auth-logo-mark">J</div>
            <span>JobHub</span>
          </div>

          <div className="auth-visual-text">
            <span className="auth-eyebrow">GROW YOUR TEAM</span>

            <h1>
              Build your team.
              <br />
              <span>Find great talent.</span>
            </h1>

            <p>
              Join JobHub and connect with talented candidates,
              manage your hiring process, and build the team your
              company needs.
            </p>
          </div>

          <div className="auth-feature-card">
            <div className="auth-feature-icon">✓</div>

            <div>
              <strong>Powerful hiring tools</strong>
              <span>Jobs, candidates and applications in one place</span>
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
            <span className="auth-label">RECRUITER ACCOUNT</span>

            <h2>Create an account</h2>

            <p>
              Create your recruiter account and start hiring talent.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleRegister}>
            <div className="auth-input-group">
              <label>Full name</label>

              <div className="auth-input-wrapper">
                <span>👤</span>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label>Work email</label>

              <div className="auth-input-wrapper">
                <span>✉</span>

                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label>Password</label>

              <div className="auth-input-wrapper">
                <span>🔒</span>

                <input
                  type="password"
                  placeholder="Create a password"
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
              Create Recruiter Account
              <span>→</span>
            </button>
          </form>

          <div className="auth-register">
            <span>Already have an account?</span>

            <button onClick={() => navigate("/recruiter-login")}>
              Recruiter Login
            </button>
          </div>

          <div className="auth-switch">
            <span>Looking for a job?</span>

            <button onClick={() => navigate("/candidate-login")}>
              Candidate Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecruiterRegister;