import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function RecruiterProfile() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [profile, setProfile] = useState({
    company: "",
    phone: "",
    location: "",
    website: "",
    about: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await api.getMyRecruiterProfile(token);

        if (data) {
          setProfile({
            company: data.company || "",
            phone: data.phone || "",
            location: data.location || "",
            website: data.website || "",
            about: data.about || "",
          });
        }
      } catch (error) {
        setError(error.message);
      }
    };

    loadProfile();
  }, [token]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      await api.saveRecruiterProfile(profile, token);

      showToast("Profile saved successfully!", "success");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <div
          className="profile-brand"
          onClick={() => navigate("/")}
        >
          <div className="profile-brand-mark">J</div>
          <span>JobHub</span>
        </div>

        <button
          className="profile-back-button"
          onClick={() => navigate("/recruiter")}
        >
          ← Dashboard
        </button>
      </header>

      <main className="profile-content">
        <section className="profile-hero">
          <div className="profile-avatar recruiter-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "R"}
          </div>

          <div>
            <span className="profile-eyebrow">
              RECRUITER PROFILE
            </span>

            <h1>{user?.name}</h1>

            <p>{user?.email}</p>
          </div>
        </section>

        {error && (
          <div className="profile-message profile-error">
            <span>!</span>
            {error}
          </div>
        )}

        <div className="profile-layout">
          <form
            className="profile-main-card"
            onSubmit={handleSubmit}
          >
            <div className="profile-card-heading">
              <div>
                <h2>Recruiter Information</h2>
                <p>
                  Keep your professional and company information
                  up to date.
                </p>
              </div>
            </div>

            <div className="profile-fields">
              <div className="profile-field profile-field-full">
                <label>Company Name</label>

                <div className="profile-input-with-icon">
                  <span>🏢</span>

                  <input
                    type="text"
                    name="company"
                    value={profile.company}
                    onChange={handleChange}
                    placeholder="Enter your company name"
                  />
                </div>
              </div>

              <div className="profile-field">
                <label>Phone Number</label>

                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="profile-field">
                <label>Location</label>

                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  placeholder="e.g. Bangalore, India"
                />
              </div>

              <div className="profile-field profile-field-full">
                <label>Company Website</label>

                <div className="profile-input-with-icon">
                  <span>🌐</span>

                  <input
                    type="text"
                    name="website"
                    value={profile.website}
                    onChange={handleChange}
                    placeholder="https://yourcompany.com"
                  />
                </div>
              </div>

              <div className="profile-field profile-field-full">
                <label>About</label>

                <textarea
                  name="about"
                  value={profile.about}
                  onChange={handleChange}
                  placeholder="Tell candidates about yourself or your company..."
                  rows="7"
                />
              </div>
            </div>

            <div className="profile-form-footer">
              <button
                type="submit"
                className="profile-save-button"
              >
                Save Profile
                <span>→</span>
              </button>
            </div>
          </form>

          <aside className="profile-side">
            <div className="recruiter-profile-card">
              <div className="recruiter-card-icon">🏢</div>

              <span className="recruiter-card-label">
                COMPANY PROFILE
              </span>

              <h2>
                {profile.company || "Your Company"}
              </h2>

              <p>
                Complete your company information to give
                candidates a better understanding of your
                organization.
              </p>

              <div className="recruiter-info-list">
                <div>
                  <span>📍</span>
                  <p>
                    {profile.location || "Location not added"}
                  </p>
                </div>

                <div>
                  <span>📞</span>
                  <p>
                    {profile.phone || "Phone not added"}
                  </p>
                </div>

                <div>
                  <span>🌐</span>
                  <p>
                    {profile.website || "Website not added"}
                  </p>
                </div>
              </div>
            </div>

            <div className="profile-tip-card">
              <span>💡</span>

              <div>
                <strong>Recruiter tip</strong>

                <p>
                  A complete company profile helps candidates
                  understand who they could be working with.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default RecruiterProfile;