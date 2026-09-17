import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await api.getJobById(id, token);

        setJob(data);

        const applications = await api.getMyApplications(
          user.id,
          token
        );

        setHasApplied(
          applications.some(
            (application) => application.job?.id === data.id
          )
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id, token, user.id]);

  const handleApply = async () => {
    if (hasApplied) {
      return;
    }

    setError("");

    try {
      await api.applyForJob(job.id, token);

      setHasApplied(true);

      showToast(
        "Application submitted successfully!",
        "success"
      );
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  if (loading) {
    return (
      <div className="job-details-page">
        <div className="job-details-loading">
          Loading job details...
        </div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="job-details-page">
        <div className="job-details-error">
          <h2>Unable to load job</h2>
          <p>{error}</p>

          <button onClick={() => navigate("/candidate")}>
            ← Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      <header className="job-details-header">
        <div
          className="job-details-brand"
          onClick={() => navigate("/")}
        >
          <div className="job-details-brand-mark">J</div>
          <span>JobHub</span>
        </div>

        <button
          className="job-details-back"
          onClick={() => navigate("/candidate")}
        >
          ← Back to Jobs
        </button>
      </header>

      <main className="job-details-content">
        <section className="job-details-hero">
          <div className="job-company-logo">
            {job.company?.name?.charAt(0)?.toUpperCase() || "C"}
          </div>

          <div className="job-details-title">
            <span className="job-details-label">
              JOB OPPORTUNITY
            </span>

            <h1>{job.title}</h1>

            <p>
              {job.company?.name || "Company"}
            </p>
          </div>
        </section>

        <div className="job-details-layout">
          <div className="job-details-main">
            <section className="job-info-card">
              <div className="job-info-grid">
                <div className="job-info-item">
                  <span className="job-info-icon">📍</span>
                  <div>
                    <small>Location</small>
                    <strong>{job.location}</strong>
                  </div>
                </div>

                <div className="job-info-item">
                  <span className="job-info-icon">💼</span>
                  <div>
                    <small>Employment Type</small>
                    <strong>
                      {job.employmentType
                        ?.replace(/_/g, " ")
                        .replace(/\b\w/g, (char) =>
                          char.toUpperCase()
                        )}
                    </strong>
                  </div>
                </div>

                <div className="job-info-item">
                  <span className="job-info-icon">💰</span>
                  <div>
                    <small>Salary</small>
                    <strong>
                      ₹{job.salaryMin} - ₹{job.salaryMax}
                    </strong>
                  </div>
                </div>

                <div className="job-info-item">
                  <span className="job-info-icon">📈</span>
                  <div>
                    <small>Experience</small>
                    <strong>
                      {job.experienceMin} - {job.experienceMax} years
                    </strong>
                  </div>
                </div>
              </div>
            </section>

            <section className="job-description-card">
              <h2>Job Description</h2>

              <div className="job-description">
                {job.description}
              </div>
            </section>
          </div>

          <aside className="job-details-sidebar">
            <div className="job-apply-card">
              <h2>
                {hasApplied
                  ? "Application submitted"
                  : "Interested in this role?"}
              </h2>

              <p>
                {hasApplied
                  ? "You have already applied for this position. You can track your application from your dashboard."
                  : "Submit your application and let the recruiter know you're interested."}
              </p>

              <button
                className={`job-apply-button ${
                  hasApplied ? "applied-button" : ""
                }`}
                onClick={handleApply}
                disabled={hasApplied}
              >
                {hasApplied ? "Applied ✓" : "Apply Now"}
                {!hasApplied && <span>→</span>}
              </button>

              <div className="job-apply-note">
                {hasApplied
                  ? "✓ Your application has been submitted"
                  : "✓ Your application will be sent to the recruiter"}
              </div>
            </div>

            <div className="job-company-card">
              <span className="job-company-label">
                ABOUT THE COMPANY
              </span>

              <div className="job-company-heading">
                <div className="job-company-small-logo">
                  {job.company?.name?.charAt(0)?.toUpperCase() ||
                    "C"}
                </div>

                <h3>{job.company?.name}</h3>
              </div>

              {job.company?.location && (
                <p>
                  📍 {job.company.location}
                </p>
              )}

              {job.company?.website && (
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit company website →
                </a>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default JobDetails;