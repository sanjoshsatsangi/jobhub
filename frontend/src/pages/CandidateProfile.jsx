import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function CandidateProfile() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [profile, setProfile] = useState({
    phone: "",
    location: "",
    education: "",
    experience: 0,
    resumeUrl: "",
    about: "",
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await api.getMyProfile(token);

        if (data) {
          setProfile({
            phone: data.phone || "",
            location: data.location || "",
            education: data.education || "",
            experience: data.experience ?? 0,
            resumeUrl: data.resumeUrl || "",
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
      await api.saveProfile(
        {
          ...profile,
          experience: Number(profile.experience),
        },
        token
      );

      showToast("Profile saved successfully!", "success");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleResumeSelect = (e) => {
    setError("");

    const file = e.target.files?.[0];

    if (!file) {
      setResumeFile(null);
      return;
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setResumeFile(null);
      e.target.value = "";

      showToast(
        "Only PDF resume files are allowed.",
        "warning"
      );

      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setResumeFile(null);
      e.target.value = "";

      showToast(
        "Resume file must be smaller than 5 MB.",
        "warning"
      );

      return;
    }

    setResumeFile(file);
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      showToast(
        "Please select a PDF resume first.",
        "warning"
      );
      return;
    }

    setError("");
    setUploadingResume(true);

    const formData = new FormData();
    formData.append("file", resumeFile);

    try {
      const response = await fetch(
        "http://localhost:8080/api/candidate-profile/resume",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.text();

      if (!response.ok) {
        throw new Error(
          result || "Failed to upload resume."
        );
      }

      setProfile((current) => ({
        ...current,
        resumeUrl: result,
      }));

      setResumeFile(null);

      showToast(
        "Resume uploaded successfully!",
        "success"
      );
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleViewResume = async () => {
    try {
      setError("");

      const resumeUrl = await api.viewResume(
        profile.resumeUrl,
        token
      );

      window.open(resumeUrl, "_blank");
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
          onClick={() => navigate("/candidate")}
        >
          ← Dashboard
        </button>
      </header>

      <main className="profile-content">
        <section className="profile-hero">
          <div className="profile-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "C"}
          </div>

          <div>
            <span className="profile-eyebrow">
              CANDIDATE PROFILE
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
                <h2>Personal Information</h2>
                <p>
                  Keep your profile information up to date.
                </p>
              </div>
            </div>

            <div className="profile-fields">
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
                <label>Education</label>

                <input
                  type="text"
                  name="education"
                  value={profile.education}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech in Electronics & Communication"
                />
              </div>

              <div className="profile-field">
                <label>Experience</label>

                <div className="profile-input-with-suffix">
                  <input
                    type="number"
                    name="experience"
                    value={profile.experience}
                    onChange={handleChange}
                    min="0"
                  />

                  <span>Years</span>
                </div>
              </div>

              <div className="profile-field profile-field-full">
                <label>About Yourself</label>

                <textarea
                  name="about"
                  value={profile.about}
                  onChange={handleChange}
                  placeholder="Tell recruiters about yourself, your skills and career goals..."
                  rows="6"
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
            <div className="profile-resume-card">
              <div className="resume-icon">PDF</div>

              <h2>Resume</h2>

              <p>
                Upload your latest resume so recruiters can
                learn more about your experience.
              </p>

              <label className="resume-upload-box">
                <span className="resume-upload-icon">
                  {resumeFile ? "✓" : "↑"}
                </span>

                <strong>
                  {resumeFile
                    ? resumeFile.name
                    : profile.resumeUrl
                    ? "Replace current resume"
                    : "Choose PDF resume"}
                </strong>

                <small>
                  PDF files only • Maximum 5 MB
                </small>

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleResumeSelect}
                />
              </label>

              <button
                type="button"
                className="resume-upload-button"
                onClick={handleResumeUpload}
                disabled={!resumeFile || uploadingResume}
              >
                {uploadingResume
                  ? "Uploading..."
                  : profile.resumeUrl
                  ? "Replace Resume"
                  : "Upload Resume"}
              </button>

              {profile.resumeUrl && (
                <div className="resume-existing">
                  <div>
                    <span className="resume-check">✓</span>

                    <div>
                      <strong>Resume uploaded</strong>
                      <small>
                        Your current resume is available
                      </small>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleViewResume}
                  >
                    View
                  </button>
                </div>
              )}
            </div>

            <div className="profile-tip-card">
              <span>💡</span>

              <div>
                <strong>Profile tip</strong>

                <p>
                  A complete profile helps recruiters
                  understand your skills and experience.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default CandidateProfile;