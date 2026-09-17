import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

function CandidateDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [employmentFilter, setEmploymentFilter] = useState("ALL");
  const [salaryFilter, setSalaryFilter] = useState("ALL");
  const [experienceFilter, setExperienceFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");

  const jobsPerPage = 5;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        let jobsData;

        if (searchTitle.trim() && searchLocation.trim()) {
          const titleResults = await api.searchJobsByTitle(
            searchTitle.trim(),
            token
          );

          jobsData = titleResults.filter((job) =>
            job.location
              ?.toLowerCase()
              .includes(searchLocation.trim().toLowerCase())
          );
        } else if (searchTitle.trim()) {
          jobsData = await api.searchJobsByTitle(
            searchTitle.trim(),
            token
          );
        } else if (searchLocation.trim()) {
          jobsData = await api.searchJobsByLocation(
            searchLocation.trim(),
            token
          );
        } else {
          jobsData = await api.getJobs(token);
        }

        setJobs(jobsData);

        const applicationsData = await api.getMyApplications(
          user.id,
          token
        );

        setApplications(applicationsData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user.id, token, searchTitle, searchLocation]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTitle,
    searchLocation,
    employmentFilter,
    salaryFilter,
    experienceFilter,
  ]);

  const hasApplied = (jobId) => {
    return applications.some(
      (application) => application.job?.id === jobId
    );
  };

  const handleApply = async (jobId) => {
    if (hasApplied(jobId)) {
      return;
    }

    setError("");

    try {
      await api.applyForJob(jobId, token);

      showToast(
        "Application submitted successfully!",
        "success"
      );

      const applicationsData = await api.getMyApplications(
        user.id,
        token
      );

      setApplications(applicationsData);
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesEmployment =
      employmentFilter === "ALL" ||
      job.employmentType?.toUpperCase() === employmentFilter;

    const matchesSalary =
      salaryFilter === "ALL" ||
      (salaryFilter === "0-5" && job.salaryMax <= 500000) ||
      (salaryFilter === "5-10" &&
        job.salaryMin >= 500000 &&
        job.salaryMax <= 1000000) ||
      (salaryFilter === "10+" && job.salaryMin >= 1000000);

    const matchesExperience =
      experienceFilter === "ALL" ||
      (experienceFilter === "0" &&
        job.experienceMin === 0) ||
      (experienceFilter === "1-2" &&
        job.experienceMin >= 1 &&
        job.experienceMax <= 2) ||
      (experienceFilter === "3-5" &&
        job.experienceMin >= 3 &&
        job.experienceMax <= 5) ||
      (experienceFilter === "5+" &&
        job.experienceMin >= 5);

    return (
      matchesEmployment &&
      matchesSalary &&
      matchesExperience
    );
  });

  const totalPages = Math.ceil(
    filteredJobs.length / jobsPerPage
  );

  const startIndex = (currentPage - 1) * jobsPerPage;

  const currentJobs = filteredJobs.slice(
    startIndex,
    startIndex + jobsPerPage
  );

  const getStatusClass = (status) => {
    switch (status) {
      case "APPLIED":
        return "status-applied";
      case "SHORTLISTED":
        return "status-shortlisted";
      case "INTERVIEW":
        return "status-interview";
      case "HIRED":
        return "status-hired";
      case "REJECTED":
        return "status-rejected";
      default:
        return "";
    }
  };

  return (
    <div className="candidate-dashboard">
      <header className="candidate-header">
        <div>
          <h1>JobHub</h1>
          <p>Find your next opportunity</p>
        </div>

        <div className="candidate-nav">
          <button onClick={() => navigate("/")}>
            Home
          </button>

          <button onClick={() => navigate("/candidate/profile")}>
            My Profile
          </button>

          <button
            onClick={() => navigate("/candidate/applications")}
          >
            My Applications
          </button>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="candidate-content">
        <section className="welcome-section">
          <div>
            <p className="welcome-label">WELCOME BACK</p>
            <h2>Hello, {user?.name}</h2>
            <p>
              Explore available jobs and track your applications.
            </p>
          </div>
        </section>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <section className="jobs-section">
          <div className="section-heading">
            <div>
              <h2>Available Jobs</h2>
              <p>
                Explore opportunities that match your skills.
              </p>
            </div>

            <span className="job-count">
              {filteredJobs.length} Jobs
            </span>
          </div>

          <div className="search-box">
            <div className="search-field">
              <label>Job Title</label>
              <input
                type="text"
                placeholder="Search by job title..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
              />
            </div>

            <div className="search-field">
              <label>Location</label>
              <input
                type="text"
                placeholder="Search by location..."
                value={searchLocation}
                onChange={(e) =>
                  setSearchLocation(e.target.value)
                }
              />
            </div>
          </div>

          <div className="employment-filter">
            <label>Employment Type</label>

            <select
              value={employmentFilter}
              onChange={(e) =>
                setEmploymentFilter(e.target.value)
              }
            >
              <option value="ALL">All Types</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="CONTRACT">Contract</option>
            </select>

            <label>Salary Range</label>

            <select
              value={salaryFilter}
              onChange={(e) => setSalaryFilter(e.target.value)}
            >
              <option value="ALL">All Salaries</option>
              <option value="0-5">Below ₹5 LPA</option>
              <option value="5-10">₹5–10 LPA</option>
              <option value="10+">₹10+ LPA</option>
            </select>

            <label>Experience</label>

            <select
              value={experienceFilter}
              onChange={(e) =>
                setExperienceFilter(e.target.value)
              }
            >
              <option value="ALL">All Experience</option>
              <option value="0">Fresher (0-1 years)</option>
              <option value="1-2">1–2 years</option>
              <option value="3-5">3–5 years</option>
              <option value="5+">5+ years</option>
            </select>

            <button
              type="button"
              className="clear-filter-button"
              onClick={() => {
                setEmploymentFilter("ALL");
                setSalaryFilter("ALL");
                setExperienceFilter("ALL");
                setSearchTitle("");
                setSearchLocation("");
              }}
            >
              Clear Filters
            </button>
          </div>

          {loading ? (
            <div className="empty-state">
              <h3>Loading jobs...</h3>
              <p>
                Please wait while we fetch the latest jobs.
              </p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="empty-state">
              <h3>No jobs found</h3>
              <p>
                Try changing your search or filters.
              </p>
            </div>
          ) : null}

          <div className="jobs-grid">
            {currentJobs.map((job) => (
              <div className="job-card" key={job.id}>
                <div className="job-card-top">
                  <div className="company-icon">
                    {job.company?.name
                      ?.charAt(0)
                      ?.toUpperCase() || "C"}
                  </div>

                  <div>
                    <h3>{job.title}</h3>

                    <p className="company-name">
                      {job.company?.name}
                    </p>
                  </div>
                </div>

                <div className="job-details">
                  <span>📍 {job.location}</span>

                  <span>
                    💼 {job.experienceMin} -{" "}
                    {job.experienceMax} years
                  </span>

                  <span>
                    ₹{job.salaryMin} - ₹{job.salaryMax}
                  </span>
                </div>

                <div className="job-card-actions">
                  <button
                    className="details-button"
                    onClick={() =>
                      navigate(`/jobs/${job.id}`)
                    }
                  >
                    View Details
                  </button>

                  <button
                    className={`apply-button ${
                      hasApplied(job.id)
                        ? "applied-button"
                        : ""
                    }`}
                    onClick={() => handleApply(job.id)}
                    disabled={hasApplied(job.id)}
                  >
                    {hasApplied(job.id)
                      ? "Applied ✓"
                      : "Apply Now"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.max(page - 1, 1)
                  )
                }
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  className={
                    currentPage === page
                      ? "active-page"
                      : ""
                  }
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(page + 1, totalPages)
                  )
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </section>

        <section className="applications-section">
          <div className="section-heading">
            <div>
              <h2>My Applications</h2>
              <p>
                Track the progress of your applications.
              </p>
            </div>

            <span className="job-count">
              {applications.length} Applications
            </span>
          </div>

          {loading ? (
            <div className="empty-state">
              <h3>Loading applications...</h3>
              <p>
                Please wait while we fetch your applications.
              </p>
            </div>
          ) : applications.length === 0 ? (
            <div className="empty-state">
              <h3>No applications yet</h3>
              <p>
                You haven't applied to any jobs yet.
              </p>
            </div>
          ) : null}

          <div className="applications-list">
            {applications.map((application) => (
              <div
                className="application-card"
                key={application.id}
              >
                <div>
                  <h3>{application.job?.title}</h3>

                  <p>
                    {application.job?.company?.name}
                  </p>

                  <span>
                    Applied{" "}
                    {new Date(
                      application.appliedAt
                    ).toLocaleDateString()}
                  </span>
                </div>

                <span
                  className={`status-badge ${getStatusClass(
                    application.status
                  )}`}
                >
                  {application.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default CandidateDashboard;