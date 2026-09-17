import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

function MyApplications() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await api.getMyApplications(
          user.id,
          token
        );

        setApplications(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, [user.id, token]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "APPLIED":
        return "application-status-applied";
      case "SHORTLISTED":
        return "application-status-shortlisted";
      case "INTERVIEW":
        return "application-status-interview";
      case "HIRED":
        return "application-status-hired";
      case "REJECTED":
        return "application-status-rejected";
      default:
        return "";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "APPLIED":
        return "Applied";
      case "SHORTLISTED":
        return "Shortlisted";
      case "INTERVIEW":
        return "Interview";
      case "HIRED":
        return "Hired";
      case "REJECTED":
        return "Rejected";
      default:
        return status || "Unknown";
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case "APPLIED":
        return "Your application has been submitted.";
      case "SHORTLISTED":
        return "Your application has been shortlisted.";
      case "INTERVIEW":
        return "You have been selected for an interview.";
      case "HIRED":
        return "Congratulations! You have been hired.";
      case "REJECTED":
        return "This application is no longer under consideration.";
      default:
        return "Application status unavailable.";
    }
  };

  const statusOrder = {
    APPLIED: 1,
    SHORTLISTED: 2,
    INTERVIEW: 3,
    HIRED: 4,
  };

  if (loading) {
    return (
      <div className="my-applications-page">
        <div className="my-applications-loading">
          <div className="my-applications-loading-spinner"></div>
          <h3>Loading your applications...</h3>
          <p>Please wait while we fetch your applications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-applications-page">
      <header className="my-applications-header">
        <div
          className="my-applications-brand"
          onClick={() => navigate("/candidate")}
        >
          <div className="my-applications-brand-mark">
            J
          </div>

          <span>JobHub</span>
        </div>

        <div className="my-applications-nav">
          <button onClick={() => navigate("/candidate")}>
            Browse Jobs
          </button>

          <button
            onClick={() => navigate("/candidate/profile")}
          >
            Profile
          </button>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="my-applications-content">
        <div className="my-applications-heading">
          <div>
            <span>APPLICATIONS</span>

            <h1>My Applications</h1>

            <p>
              Track the status of jobs you have applied for.
            </p>
          </div>

          <div className="my-applications-count">
            <strong>{applications.length}</strong>

            <span>
              {applications.length === 1
                ? "Application"
                : "Applications"}
            </span>
          </div>
        </div>

        {error && (
          <div className="my-applications-error">
            {error}
          </div>
        )}

        {!error && applications.length === 0 && (
          <div className="my-applications-empty">
            <div className="my-applications-empty-icon">
              📄
            </div>

            <h2>No applications yet</h2>

            <p>
              Start exploring jobs and submit your first
              application.
            </p>

            <button
              onClick={() => navigate("/candidate")}
            >
              Browse Jobs →
            </button>
          </div>
        )}

        {applications.length > 0 && (
          <div className="my-applications-list">
            {applications.map((application) => {
              const currentOrder =
                statusOrder[application.status] || 0;

              return (
                <div
                  className="my-application-card"
                  key={application.id}
                >
                  <div className="my-application-main">
                    <div className="my-application-company-logo">
                      {application.job?.company?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "C"}
                    </div>

                    <div className="my-application-info">
                      <h2>
                        {application.job?.title ||
                          "Job Position"}
                      </h2>

                      <p className="my-application-company">
                        {application.job?.company?.name ||
                          "Company"}
                      </p>

                      <div className="my-application-meta">
                        <span>
                          📍{" "}
                          {application.job?.location ||
                            "Location not specified"}
                        </span>

                        <span>
                          💼{" "}
                          {application.job
                            ?.employmentType .replace(/_/g, " ")
                            .replace(/\b\w/g, (char) => char.toUpperCase()) ||
                            "Employment type not specified" }
                        </span>

                        {application.job?.salaryMin !=
                          null &&
                          application.job?.salaryMax !=
                            null && (
                            <span>
                              💰 ₹
                              {(
                                application.job.salaryMin /
                                100000
                              ).toFixed(1)}
                              –
                              {(
                                application.job.salaryMax /
                                100000
                              ).toFixed(1)}{" "}
                              LPA
                            </span>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="my-application-side">
                    <div className="my-application-status-row">
                      <span
                        className={`my-application-status ${getStatusClass(
                          application.status
                        )}`}
                      >
                        {getStatusLabel(
                          application.status
                        )}
                      </span>

                      <span className="my-application-date">
                        Applied{" "}
                        {application.appliedAt
                          ? new Date(
                              application.appliedAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>

                    <p className="my-application-status-description">
                      {getStatusDescription(
                        application.status
                      )}
                    </p>

                    {application.status === "REJECTED" ? (
                      <div className="rejected-application-status">
                        <div className="rejected-status-icon">
                          ✕
                        </div>

                        <div>
                          <strong>
                            Application Rejected
                          </strong>

                          <p>
                            You can continue exploring
                            other opportunities.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="application-timeline">
                        {[
                          "APPLIED",
                          "SHORTLISTED",
                          "INTERVIEW",
                          "HIRED",
                        ].map((status, index) => {
                          const isCompleted =
                            currentOrder >=
                            statusOrder[status];

                          const isCurrent =
                            application.status === status;

                          return (
                            <div
                              className={`timeline-step ${
                                isCompleted
                                  ? "completed"
                                  : ""
                              } ${
                                isCurrent
                                  ? "current"
                                  : ""
                              }`}
                              key={status}
                            >
                              <div className="timeline-dot">
                                {isCompleted
                                  ? "✓"
                                  : index + 1}
                              </div>

                              <span>
                                {getStatusLabel(status)}
                              </span>

                              {index < 3 && (
                                <div
                                  className={`timeline-line ${
                                    currentOrder >
                                    statusOrder[status]
                                      ? "completed"
                                      : ""
                                  }`}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {application.job?.id && (
                      <button
                        className="my-application-view"
                        onClick={() =>
                          navigate(
                            `/jobs/${application.job.id}`
                          )
                        }
                      >
                        View Job →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyApplications;