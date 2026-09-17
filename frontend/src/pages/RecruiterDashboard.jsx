import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { api } from "../services/api";

function RecruiterDashboard() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [candidateProfiles, setCandidateProfiles] = useState({});
  const [visibleProfiles, setVisibleProfiles] = useState({});

  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [jobSearch, setJobSearch] = useState("");
  const [jobLocationSearch, setJobLocationSearch] =
    useState("");

  const [applications, setApplications] = useState([]);
  const [applicationFilter, setApplicationFilter] =
    useState("ALL");
  const [applicationPage, setApplicationPage] = useState(1);
  const applicationsPerPage = 5;

  const [analyticsRange, setAnalyticsRange] = useState("ALL");

  const [company, setCompany] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
  });

  const [job, setJob] = useState({
    companyId: "",
    title: "",
    description: "",
    location: "",
    employmentType: "FULL_TIME",
    salaryMin: "",
    salaryMax: "",
    experienceMin: 0,
    experienceMax: 1,
  });

  const [editingJobId, setEditingJobId] = useState(null);

  const [editJob, setEditJob] = useState({
    title: "",
    description: "",
    location: "",
    employmentType: "FULL_TIME",
    salaryMin: "",
    salaryMax: "",
    experienceMin: 0,
    experienceMax: 1,
  });

  const loadCompanies = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/companies",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch companies");
      }

      const data = await response.json();

      const myCompanies = data.filter(
        (item) => item.owner?.id === user?.id
      );

      setCompanies(myCompanies);
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const loadApplications = async (jobsData) => {
    try {
      const allApplications = [];

      for (const currentJob of jobsData) {
        const response = await fetch(
          `http://localhost:8080/api/applications/job/${currentJob.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }

        const jobApplications = await response.json();

        allApplications.push(...jobApplications);
      }

      setApplications(allApplications);
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const loadJobs = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();

      const myJobs = data.filter(
        (item) => item.company?.owner?.id === user?.id
      );

      setJobs(myJobs);

      await loadApplications(myJobs);
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const loadCandidateProfile = async (candidateId) => {
    try {
      const profile = await api.getCandidateProfile(
        candidateId,
        token
      );

      setCandidateProfiles((currentProfiles) => ({
        ...currentProfiles,
        [candidateId]: profile,
      }));
    } catch (error) {
      showToast(
        error.message || "Failed to load candidate profile",
        "error"
      );
    }
  };

  useEffect(() => {
    loadCompanies();
    loadJobs();
  }, [token, user?.id]);

  useEffect(() => {
    const loadProfiles = async () => {
      for (const application of applications) {
        const candidateId = application.candidate?.id;

        if (
          candidateId &&
          !candidateProfiles[candidateId]
        ) {
          await loadCandidateProfile(candidateId);
        }
      }
    };

    if (applications.length > 0) {
      loadProfiles();
    }
  }, [applications]);

  const handleCompanyChange = (e) => {
    setCompany({
      ...company,
      [e.target.name]: e.target.value,
    });
  };

  const handleJobChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8080/api/companies",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(company),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText || "Failed to create company"
        );
      }

      showToast(
        "Company created successfully!",
        "success"
      );

      setCompany({
        name: "",
        description: "",
        website: "",
        location: "",
      });

      await loadCompanies();
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8080/api/jobs?companyId=${job.companyId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: job.title,
            description: job.description,
            location: job.location,
            employmentType: job.employmentType,
            salaryMin: Number(job.salaryMin),
            salaryMax: Number(job.salaryMax),
            experienceMin: Number(job.experienceMin),
            experienceMax: Number(job.experienceMax),
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText || "Failed to create job"
        );
      }

      showToast(
        "Job created successfully!",
        "success"
      );

      setJob({
        companyId: "",
        title: "",
        description: "",
        location: "",
        employmentType: "FULL_TIME",
        salaryMin: "",
        salaryMax: "",
        experienceMin: 0,
        experienceMax: 1,
      });

      await loadJobs();
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const startEditingJob = (currentJob) => {
    setEditingJobId(currentJob.id);

    setEditJob({
      title: currentJob.title || "",
      description: currentJob.description || "",
      location: currentJob.location || "",
      employmentType:
        currentJob.employmentType || "FULL_TIME",
      salaryMin: currentJob.salaryMin || "",
      salaryMax: currentJob.salaryMax || "",
      experienceMin:
        currentJob.experienceMin ?? 0,
      experienceMax:
        currentJob.experienceMax ?? 1,
    });
  };

  const handleEditJobChange = (e) => {
    setEditJob({
      ...editJob,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditJob = async (jobId, updatedJob) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/jobs/${jobId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedJob),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText || "Failed to update job"
        );
      }

      showToast(
        "Job updated successfully!",
        "success"
      );

      await loadJobs();

      setEditingJobId(null);
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/jobs/${jobId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText || "Failed to delete job"
        );
      }

      showToast(
        "Job deleted successfully!",
        "success"
      );

      await loadJobs();
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleStatusChange = async (
    applicationId,
    status
  ) => {
    try {
      const updatedApplication =
        await api.updateApplicationStatus(
          applicationId,
          status,
          token
        );

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === applicationId
            ? updatedApplication
            : application
        )
      );

      showToast(
        "Application status updated successfully!",
        "success"
      );
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleViewResume = async (resumeUrl) => {
    try {
      const resumeObjectUrl = await api.viewResume(
        resumeUrl,
        token
      );

      window.open(resumeObjectUrl, "_blank");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
        return status;
    }
  };

  const filteredApplicationsForAnalytics = useMemo(() => {
    if (analyticsRange === "ALL") {
      return applications;
    }

    const days = Number(analyticsRange);

    const cutoffDate = new Date();

    cutoffDate.setDate(
      cutoffDate.getDate() - days
    );

    return applications.filter((application) => {
      if (!application.appliedAt) {
        return false;
      }

      const appliedDate = new Date(
        application.appliedAt
      );

      return appliedDate >= cutoffDate;
    });
  }, [applications, analyticsRange]);

  const analytics = useMemo(() => {
    const analyticsApplications =
      filteredApplicationsForAnalytics;

    const totalApplications =
      analyticsApplications.length;

    const applied = analyticsApplications.filter(
      (application) =>
        application.status === "APPLIED"
    ).length;

    const shortlisted = analyticsApplications.filter(
      (application) =>
        application.status === "SHORTLISTED"
    ).length;

    const interview = analyticsApplications.filter(
      (application) =>
        application.status === "INTERVIEW"
    ).length;

    const hired = analyticsApplications.filter(
      (application) =>
        application.status === "HIRED"
    ).length;

    const rejected = analyticsApplications.filter(
      (application) =>
        application.status === "REJECTED"
    ).length;

    const averageApplicationsPerJob =
      jobs.length > 0
        ? (
            totalApplications / jobs.length
          ).toFixed(1)
        : "0.0";

    const hiringRate =
      totalApplications > 0
        ? ((hired / totalApplications) * 100).toFixed(1)
        : "0.0";

    const conversionRate =
      totalApplications > 0
        ? (
            ((shortlisted + interview + hired) /
              totalApplications) *
            100
          ).toFixed(1)
        : "0.0";

    return {
      totalJobs: jobs.length,
      totalApplications,
      applied,
      shortlisted,
      interview,
      hired,
      rejected,
      averageApplicationsPerJob,
      hiringRate,
      conversionRate,
    };
  }, [
    filteredApplicationsForAnalytics,
    jobs.length,
  ]);

  const getStatusPercentage = (count) => {
    if (analytics.totalApplications === 0) {
      return 0;
    }

    return Math.round(
      (count / analytics.totalApplications) * 100
    );
  };

  const filteredApplications = applications.filter(
    (application) =>
      applicationFilter === "ALL" ||
      application.status === applicationFilter
  );

  const totalApplicationPages = Math.ceil(
    filteredApplications.length /
      applicationsPerPage
  );

  const applicationStartIndex =
    (applicationPage - 1) *
    applicationsPerPage;

  const currentApplications =
    filteredApplications.slice(
      applicationStartIndex,
      applicationStartIndex +
        applicationsPerPage
    );

  const filteredJobs = jobs.filter((currentJob) => {
    const matchesTitle = currentJob.title
      ?.toLowerCase()
      .includes(jobSearch.trim().toLowerCase());

    const matchesLocation = currentJob.location
      ?.toLowerCase()
      .includes(
        jobLocationSearch.trim().toLowerCase()
      );

    return matchesTitle && matchesLocation;
  });

  useEffect(() => {
    setApplicationPage(1);
  }, [applicationFilter]);

  useEffect(() => {
    if (
      totalApplicationPages > 0 &&
      applicationPage > totalApplicationPages
    ) {
      setApplicationPage(totalApplicationPages);
    }
  }, [
    totalApplicationPages,
    applicationPage,
  ]);

  return (
    <div className="recruiter-dashboard">
      <header className="recruiter-header">
        <div>
          <h1>JobHub</h1>
          <p>Find your next opportunity</p>
        </div>

        <div className="recruiter-nav">
          <button onClick={() => navigate("/")}>
            Home
          </button>

          <button
            onClick={() =>
              navigate("/recruiter/profile")
            }
          >
            My Profile
          </button>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="recruiter-content">
        <section className="welcome-section">
          <div>
            <p className="welcome-label">
              WELCOME BACK
            </p>

            <h2>Hello, {user?.name}</h2>

            <p>
              Here's an overview of your hiring
              activity.
            </p>
          </div>
        </section>

        <section className="analytics-section">
          <div className="section-heading analytics-heading">
            <div>
              <h2>Recruiter Analytics</h2>

              <p>
                A snapshot of your hiring pipeline.
              </p>
            </div>

            <div className="analytics-range">
              <button
                className={
                  analyticsRange === "ALL"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setAnalyticsRange("ALL")
                }
              >
                All Time
              </button>

              <button
                className={
                  analyticsRange === "30"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setAnalyticsRange("30")
                }
              >
                Last 30 Days
              </button>

              <button
                className={
                  analyticsRange === "7"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setAnalyticsRange("7")
                }
              >
                Last 7 Days
              </button>
            </div>
          </div>

          <div className="analytics-cards">
            <div className="analytics-card">
              <h3>Total Jobs</h3>
              <p>{analytics.totalJobs}</p>
            </div>

            <div className="analytics-card">
              <h3>Applications</h3>
              <p>
                {analytics.totalApplications}
              </p>
            </div>

            <div className="analytics-card">
              <h3>Applied</h3>
              <p>{analytics.applied}</p>
            </div>

            <div className="analytics-card">
              <h3>Shortlisted</h3>
              <p>{analytics.shortlisted}</p>
            </div>

            <div className="analytics-card">
              <h3>Interviews</h3>
              <p>{analytics.interview}</p>
            </div>

            <div className="analytics-card">
              <h3>Hired</h3>
              <p>{analytics.hired}</p>
            </div>

            <div className="analytics-card">
              <h3>Rejected</h3>
              <p>{analytics.rejected}</p>
            </div>

            <div className="analytics-card">
              <h3>Avg. Applications / Job</h3>
              <p>
                {analytics.averageApplicationsPerJob}
              </p>
            </div>

            <div className="analytics-card">
              <h3>Hiring Rate</h3>
              <p>
                {analytics.hiringRate}%
              </p>
            </div>

            <div className="analytics-card">
              <h3>Pipeline Conversion</h3>
              <p>
                {analytics.conversionRate}%
              </p>
            </div>
          </div>

          <div className="analytics-status">
            <div className="analytics-subheading">
              <div>
                <h3>
                  Application Status Breakdown
                </h3>

                <p>
                  Distribution of applications in
                  the selected period.
                </p>
              </div>
            </div>

            <div className="analytics-status-grid">
              {[
                [
                  "APPLIED",
                  analytics.applied,
                ],
                [
                  "SHORTLISTED",
                  analytics.shortlisted,
                ],
                [
                  "INTERVIEW",
                  analytics.interview,
                ],
                [
                  "HIRED",
                  analytics.hired,
                ],
                [
                  "REJECTED",
                  analytics.rejected,
                ],
              ].map(([status, count]) => {
                const percentage =
                  getStatusPercentage(count);

                return (
                  <div
                    className="analytics-status-item"
                    key={status}
                  >
                    <div className="analytics-status-top">
                      <span
                        className={`analytics-status-label ${getStatusClass(
                          status
                        )}`}
                      >
                        {getStatusLabel(status)}
                      </span>

                      <strong>{count}</strong>
                    </div>

                    <div className="analytics-progress">
                      <div
                        className={`analytics-progress-fill ${getStatusClass(
                          status
                        )}`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <span className="analytics-percentage">
                      {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="analytics-pipeline">
            <div className="analytics-subheading">
              <div>
                <h3>Hiring Pipeline</h3>

                <p>
                  Track how candidates move through
                  your recruitment process.
                </p>
              </div>
            </div>

            <div className="pipeline-grid">
              <div className="pipeline-step">
                <span className="pipeline-number">
                  01
                </span>

                <div>
                  <strong>Applied</strong>
                  <span>
                    {analytics.applied} candidates
                  </span>
                </div>
              </div>

              <div className="pipeline-arrow">
                →
              </div>

              <div className="pipeline-step">
                <span className="pipeline-number">
                  02
                </span>

                <div>
                  <strong>Shortlisted</strong>
                  <span>
                    {analytics.shortlisted} candidates
                  </span>
                </div>
              </div>

              <div className="pipeline-arrow">
                →
              </div>

              <div className="pipeline-step">
                <span className="pipeline-number">
                  03
                </span>

                <div>
                  <strong>Interview</strong>
                  <span>
                    {analytics.interview} candidates
                  </span>
                </div>
              </div>

              <div className="pipeline-arrow">
                →
              </div>

              <div className="pipeline-step">
                <span className="pipeline-number">
                  04
                </span>

                <div>
                  <strong>Hired</strong>
                  <span>
                    {analytics.hired} candidates
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="companies-section">
          <div className="section-heading">
            <div>
              <h2>My Companies</h2>

              <p>
                Manage the companies you recruit for.
              </p>
            </div>

            <span className="job-count">
              {companies.length} Companies
            </span>
          </div>

          <form
            className="dashboard-form"
            onSubmit={handleCreateCompany}
          >
            <input
              type="text"
              name="name"
              placeholder="Company Name"
              value={company.name}
              onChange={handleCompanyChange}
              required
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={company.location}
              onChange={handleCompanyChange}
            />

            <input
              type="text"
              name="website"
              placeholder="Website"
              value={company.website}
              onChange={handleCompanyChange}
            />

            <textarea
              name="description"
              placeholder="Company Description"
              value={company.description}
              onChange={handleCompanyChange}
            />

            <button type="submit">
              Create Company
            </button>
          </form>

          {companies.length === 0 && (
            <div className="empty-state">
              <h3>No companies yet</h3>

              <p>
                Create a company to start posting
                jobs.
              </p>
            </div>
          )}

          <div className="jobs-grid">
            {companies.map((item) => (
              <div
                className="job-card"
                key={item.id}
              >
                <div className="job-card-top">
                  <div className="company-icon">
                    {item.name
                      ?.charAt(0)
                      ?.toUpperCase() || "C"}
                  </div>

                  <div>
                    <h3>{item.name}</h3>

                    <p className="company-name">
                      {item.location ||
                        "Location not set"}
                    </p>
                  </div>
                </div>

                <div className="job-details">
                  <span>
                    🌐{" "}
                    {item.website || "No website"}
                  </span>

                  <span>
                    {item.description ||
                      "No description"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="jobs-section">
          <div className="section-heading">
            <div>
              <h2>My Jobs</h2>

              <p>
                Create and manage your job postings.
              </p>

              <div className="job-search">
                <input
                  type="text"
                  placeholder="Search jobs by title..."
                  value={jobSearch}
                  onChange={(e) =>
                    setJobSearch(e.target.value)
                  }
                />

                <input
                  type="text"
                  placeholder="Search by location..."
                  value={jobLocationSearch}
                  onChange={(e) =>
                    setJobLocationSearch(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  className="clear-job-search"
                  onClick={() => {
                    setJobSearch("");
                    setJobLocationSearch("");
                  }}
                >
                  Clear
                </button>
              </div>
            </div>

            <span className="job-count">
              {filteredJobs.length} Jobs
            </span>
          </div>

          <form
            className="dashboard-form"
            onSubmit={handleCreateJob}
          >
            <select
              name="companyId"
              value={job.companyId}
              onChange={handleJobChange}
              required
            >
              <option value="">
                Select Company
              </option>

              {companies.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="title"
              placeholder="Job Title"
              value={job.title}
              onChange={handleJobChange}
              required
            />

            <input
              type="text"
              name="location"
              placeholder="Job Location"
              value={job.location}
              onChange={handleJobChange}
            />

            <select
              name="employmentType"
              value={job.employmentType}
              onChange={handleJobChange}
            >
              <option value="FULL_TIME">
                Full Time
              </option>

              <option value="PART_TIME">
                Part Time
              </option>

              <option value="INTERNSHIP">
                Internship
              </option>

              <option value="CONTRACT">
                Contract
              </option>
            </select>

            <input
              type="number"
              name="salaryMin"
              placeholder="Minimum Salary"
              value={job.salaryMin}
              onChange={handleJobChange}
              required
            />

            <input
              type="number"
              name="salaryMax"
              placeholder="Maximum Salary"
              value={job.salaryMax}
              onChange={handleJobChange}
              required
            />

            <input
              type="number"
              name="experienceMin"
              placeholder="Minimum Experience (years)"
              value={job.experienceMin}
              onChange={handleJobChange}
              min="0"
              required
            />

            <input
              type="number"
              name="experienceMax"
              placeholder="Maximum Experience (years)"
              value={job.experienceMax}
              onChange={handleJobChange}
              min="0"
              required
            />

            <textarea
              name="description"
              placeholder="Job Description"
              value={job.description}
              onChange={handleJobChange}
              required
            />

            <button type="submit">
              Create Job
            </button>
          </form>

          {jobs.length === 0 && (
            <div className="empty-state">
              <h3>No jobs yet</h3>

              <p>
                Create a job posting to start
                receiving applications.
              </p>
            </div>
          )}

          {jobs.length > 0 &&
            filteredJobs.length === 0 && (
              <div className="empty-state">
                <h3>No matching jobs</h3>

                <p>
                  Try searching with a different
                  title or location.
                </p>
              </div>
            )}

          <div className="jobs-grid">
            {filteredJobs.map((item) => (
              <div
                className="job-card"
                key={item.id}
              >
                <div className="job-card-top">
                  <div className="company-icon">
                    {item.company?.name
                      ?.charAt(0)
                      ?.toUpperCase() || "C"}
                  </div>

                  <div>
                    <h3>{item.title}</h3>

                    <p className="company-name">
                      {item.company?.name}
                    </p>
                  </div>
                </div>

                <div className="job-details">
                  <span>
                    📍 {item.location}
                  </span>

                  <span>
                    💼{" "}
                    {item.employmentType
                      ?.replace(/_/g, " ")
                      .replace(
                        /\b\w/g,
                        (char) => char.toUpperCase()
                      )}
                  </span>

                  <span>
                    🧑‍💼 {item.experienceMin} -{" "}
                    {item.experienceMax} years
                  </span>

                  <span>
                    ₹{item.salaryMin} - ₹
                    {item.salaryMax}
                  </span>
                </div>

                <p>{item.description}</p>

                <div className="job-card-actions">
                  <button
                    onClick={() =>
                      startEditingJob(item)
                    }
                  >
                    Edit Job
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteJob(item.id)
                    }
                  >
                    Delete Job
                  </button>
                </div>

                {editingJobId === item.id && (
                  <div className="edit-job-form">
                    <h4>Edit Job</h4>

                    <input
                      type="text"
                      name="title"
                      placeholder="Job Title"
                      value={editJob.title}
                      onChange={
                        handleEditJobChange
                      }
                    />

                    <input
                      type="text"
                      name="location"
                      placeholder="Job Location"
                      value={editJob.location}
                      onChange={
                        handleEditJobChange
                      }
                    />

                    <select
                      name="employmentType"
                      value={
                        editJob.employmentType
                      }
                      onChange={
                        handleEditJobChange
                      }
                    >
                      <option value="FULL_TIME">
                        Full Time
                      </option>

                      <option value="PART_TIME">
                        Part Time
                      </option>

                      <option value="INTERNSHIP">
                        Internship
                      </option>

                      <option value="CONTRACT">
                        Contract
                      </option>
                    </select>

                    <input
                      type="number"
                      name="salaryMin"
                      placeholder="Minimum Salary"
                      value={editJob.salaryMin}
                      onChange={
                        handleEditJobChange
                      }
                    />

                    <input
                      type="number"
                      name="salaryMax"
                      placeholder="Maximum Salary"
                      value={editJob.salaryMax}
                      onChange={
                        handleEditJobChange
                      }
                    />

                    <input
                      type="number"
                      name="experienceMin"
                      placeholder="Minimum Experience"
                      value={
                        editJob.experienceMin
                      }
                      onChange={
                        handleEditJobChange
                      }
                      min="0"
                    />

                    <input
                      type="number"
                      name="experienceMax"
                      placeholder="Maximum Experience"
                      value={
                        editJob.experienceMax
                      }
                      onChange={
                        handleEditJobChange
                      }
                      min="0"
                    />

                    <textarea
                      name="description"
                      placeholder="Job Description"
                      value={
                        editJob.description
                      }
                      onChange={
                        handleEditJobChange
                      }
                    />

                    <button
                      onClick={() =>
                        handleEditJob(
                          item.id,
                          {
                            ...editJob,
                            salaryMin:
                              Number(
                                editJob.salaryMin
                              ),
                            salaryMax:
                              Number(
                                editJob.salaryMax
                              ),
                            experienceMin:
                              Number(
                                editJob.experienceMin
                              ),
                            experienceMax:
                              Number(
                                editJob.experienceMax
                              ),
                          }
                        )
                      }
                    >
                      Save Changes
                    </button>

                    <button
                      onClick={() =>
                        setEditingJobId(null)
                      }
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="applications-section">
          <div className="section-heading">
            <div>
              <h2>
                Applications ({applications.length})
              </h2>

              <div className="application-filters">
                {[
                  "ALL",
                  "APPLIED",
                  "SHORTLISTED",
                  "INTERVIEW",
                  "HIRED",
                  "REJECTED",
                ].map((filter) => (
                  <button
                    key={filter}
                    className={
                      applicationFilter === filter
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setApplicationFilter(
                        filter
                      )
                    }
                  >
                    {filter === "ALL"
                      ? "All"
                      : getStatusLabel(filter)}
                  </button>
                ))}
              </div>

              <p className="application-filter-count">
                Showing{" "}
                {filteredApplications.length}{" "}
                applications
              </p>

              <p>
                Review and manage candidate
                applications.
              </p>
            </div>

            <span className="job-count">
              {applications.length} Applications
            </span>
          </div>

          {applications.length === 0 && (
            <div className="empty-state">
              <h3>No applications yet</h3>

              <p>
                Applications will appear here once
                candidates apply.
              </p>
            </div>
          )}

          <div className="applications-list">
            {currentApplications.map(
              (application) => (
                <div
                  className="application-card"
                  key={application.id}
                >
                  <div className="application-status-row">
                    <div>
                      <h3>
                        {application.candidate?.name}
                      </h3>

                      <p>
                        {application.job?.title} ·{" "}
                        {
                          application.job?.company
                            ?.name
                        }
                      </p>

                      <span>
                        Applied{" "}
                        {application.appliedAt
                          ? new Date(
                              application.appliedAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>

                    <span
                      className={`status-badge ${getStatusClass(
                        application.status
                      )}`}
                    >
                      {getStatusLabel(
                        application.status
                      )}
                    </span>
                  </div>

                  <p>
                    Email:{" "}
                    {application.candidate?.email}
                  </p>

                  <button
                    className="view-profile-button"
                    onClick={() => {
                      const candidateId =
                        application.candidate?.id;

                      if (!candidateId) {
                        return;
                      }

                      setVisibleProfiles(
                        (current) => ({
                          ...current,
                          [candidateId]:
                            !current[candidateId],
                        })
                      );
                    }}
                  >
                    {visibleProfiles[
                      application.candidate?.id
                    ]
                      ? "Hide Candidate Profile"
                      : "View Candidate Profile"}
                  </button>

                  {visibleProfiles[
                    application.candidate?.id
                  ] &&
                    candidateProfiles[
                      application.candidate?.id
                    ] && (
                      <div className="candidate-profile">
                        <p>
                          <strong>
                            Phone:
                          </strong>{" "}
                          {candidateProfiles[
                            application.candidate.id
                          ].phone || "N/A"}
                        </p>

                        <p>
                          <strong>
                            Location:
                          </strong>{" "}
                          {candidateProfiles[
                            application.candidate.id
                          ].location || "N/A"}
                        </p>

                        <p>
                          <strong>
                            Education:
                          </strong>{" "}
                          {candidateProfiles[
                            application.candidate.id
                          ].education || "N/A"}
                        </p>

                        <p>
                          <strong>
                            Experience:
                          </strong>{" "}
                          {candidateProfiles[
                            application.candidate.id
                          ].experience ?? 0}{" "}
                          years
                        </p>

                        <p>
                          <strong>
                            About:
                          </strong>{" "}
                          {candidateProfiles[
                            application.candidate.id
                          ].about || "N/A"}
                        </p>

                        {candidateProfiles[
                          application.candidate.id
                        ].resumeUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              handleViewResume(
                                candidateProfiles[
                                  application
                                    .candidate
                                    .id
                                ].resumeUrl
                              )
                            }
                          >
                            View Resume
                          </button>
                        )}
                      </div>
                    )}

                  <select
                    value={application.status}
                    onChange={(e) => {
                      const newStatus =
                        e.target.value;

                      if (
                        newStatus !==
                        application.status
                      ) {
                        handleStatusChange(
                          application.id,
                          newStatus
                        );
                      }
                    }}
                  >
                    <option value="APPLIED">
                      Applied
                    </option>

                    <option value="SHORTLISTED">
                      Shortlisted
                    </option>

                    <option value="INTERVIEW">
                      Interview
                    </option>

                    <option value="HIRED">
                      Hired
                    </option>

                    <option value="REJECTED">
                      Rejected
                    </option>
                  </select>
                </div>
              )
            )}
          </div>

          {totalApplicationPages > 1 && (
            <div className="application-pagination">
              <button
                type="button"
                disabled={applicationPage === 1}
                onClick={() =>
                  setApplicationPage(
                    (page) => page - 1
                  )
                }
              >
                Previous
              </button>

              <span>
                Page {applicationPage} of{" "}
                {totalApplicationPages}
              </span>

              <button
                type="button"
                disabled={
                  applicationPage ===
                  totalApplicationPages
                }
                onClick={() =>
                  setApplicationPage(
                    (page) => page + 1
                  )
                }
              >
                Next
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default RecruiterDashboard;