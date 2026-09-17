import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const categories = [
    { icon: "💻", title: "Software Development", jobs: "1,240+ Jobs" },
    { icon: "📊", title: "Data & Analytics", jobs: "860+ Jobs" },
    { icon: "🎨", title: "Design", jobs: "520+ Jobs" },
    { icon: "📱", title: "Product & Marketing", jobs: "740+ Jobs" },
    { icon: "💼", title: "Finance", jobs: "430+ Jobs" },
    { icon: "⚙️", title: "Engineering", jobs: "680+ Jobs" },
  ];

  const featuredJobs = [
    {
      company: "TechCorp",
      title: "Software Engineer",
      location: "Bangalore",
      type: "Full Time",
      salary: "₹6L - ₹10L",
      logo: "T",
    },
    {
      company: "InnovateLabs",
      title: "Frontend Developer",
      location: "Hyderabad",
      type: "Full Time",
      salary: "₹5L - ₹9L",
      logo: "I",
    },
    {
      company: "DataWorks",
      title: "Junior Data Analyst",
      location: "Remote",
      type: "Full Time",
      salary: "₹4L - ₹7L",
      logo: "D",
    },
  ];

  const faqs = [
    {
      question: "Is JobHub free for candidates?",
      answer:
        "Yes. Candidates can create a profile, explore available jobs, and apply for opportunities through JobHub.",
    },
    {
      question: "Can recruiters post jobs?",
      answer:
        "Yes. Recruiters can create companies, post jobs, manage applications, and update candidate application statuses.",
    },
    {
      question: "Can I track my applications?",
      answer:
        "Yes. Your candidate dashboard allows you to view your applications and track their current status.",
    },
    {
      question: "How do I create a recruiter account?",
      answer:
        "Click Get Started or Register as Recruiter and create your recruiter account.",
    },
  ];

  const scrollToJobs = () => {
    document
      .getElementById("featured-jobs")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-page">
      <nav className="home-navbar">
        <div className="home-logo" onClick={() => navigate("/")}>
          <div className="logo-mark">J</div>
          <span>JobHub</span>
        </div>

        <div className="home-nav-links">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={scrollToJobs}>Find Jobs</button>
          <button
            onClick={() =>
              document
                .getElementById("how-it-works")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            How It Works
          </button>
          <button
            onClick={() =>
              document
                .getElementById("for-recruiters")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            For Recruiters
          </button>
        </div>

        <div className="home-nav-actions">
          <button
            className="nav-login"
            onClick={() => navigate("/candidate-login")}
          >
            Login
          </button>

          <button
            className="nav-get-started"
            onClick={() => navigate("/")}
          >
            Get Started
          </button>
        </div>
      </nav>

      <main>
        <section className="hero-section">
          <div className="hero-background-circle hero-circle-one"></div>
          <div className="hero-background-circle hero-circle-two"></div>

          <div className="hero-content">
            <div className="hero-badge">
              <span>✦</span>
              Your career starts here
            </div>

            <h1>
              Find the job
              <br />
              <span>you've been looking for.</span>
            </h1>

            <p>
              Discover opportunities from growing companies, build your
              professional profile, and take the next step in your career.
            </p>

            <div className="hero-search">
              <div className="hero-search-field">
                <span>⌕</span>
                <div>
                  <label>Job title or keyword</label>
                  <input placeholder="Software Engineer" />
                </div>
              </div>

              <div className="hero-search-divider"></div>

              <div className="hero-search-field">
                <span>⌖</span>
                <div>
                  <label>Location</label>
                  <input placeholder="Bangalore, Remote..." />
                </div>
              </div>

              <button onClick={scrollToJobs}>Search Jobs</button>
            </div>

            <div className="popular-searches">
              <span>Popular:</span>
              <button onClick={scrollToJobs}>Software Engineer</button>
              <button onClick={scrollToJobs}>Data Analyst</button>
              <button onClick={scrollToJobs}>Frontend Developer</button>
              <button onClick={scrollToJobs}>Remote</button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card hero-card-main">
              <div className="hero-card-top">
                <div className="hero-company-icon">T</div>
                <div>
                  <strong>Software Engineer</strong>
                  <span>TechCorp</span>
                </div>
                <div className="hero-heart">♡</div>
              </div>

              <div className="hero-job-info">
                <span>📍 Bangalore</span>
                <span>💼 Full Time</span>
              </div>

              <div className="hero-card-bottom">
                <strong>₹6L - ₹10L</strong>
                <button onClick={() => navigate("/candidate-login")}>
                  Apply
                </button>
              </div>
            </div>

            <div className="floating-card floating-card-top">
              <div className="floating-icon">✓</div>
              <div>
                <strong>Application Sent</strong>
                <span>Just now</span>
              </div>
            </div>

            <div className="floating-card floating-card-bottom">
              <div className="people-icons">
                <span>👨</span>
                <span>👩</span>
                <span>👨</span>
              </div>
              <div>
                <strong>10K+ Candidates</strong>
                <span>Finding opportunities</span>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="stat-item">
            <strong>10K+</strong>
            <span>Active Candidates</span>
          </div>
          <div className="stat-item">
            <strong>2.5K+</strong>
            <span>Companies</span>
          </div>
          <div className="stat-item">
            <strong>15K+</strong>
            <span>Job Opportunities</span>
          </div>
          <div className="stat-item">
            <strong>8K+</strong>
            <span>Successful Hires</span>
          </div>
        </section>

        <section className="categories-section">
          <div className="section-header">
            <div>
              <span className="section-label">EXPLORE OPPORTUNITIES</span>
              <h2>Browse by category</h2>
              <p>Find opportunities that match your skills and interests.</p>
            </div>

            <button onClick={scrollToJobs} className="view-all-button">
              View all jobs →
            </button>
          </div>

          <div className="categories-grid">
            {categories.map((category) => (
              <div
                className="category-card"
                key={category.title}
                onClick={scrollToJobs}
              >
                <div className="category-icon">{category.icon}</div>
                <h3>{category.title}</h3>
                <p>{category.jobs}</p>
                <span>→</span>
              </div>
            ))}
          </div>
        </section>

        <section className="featured-section" id="featured-jobs">
          <div className="section-header">
            <div>
              <span className="section-label">LATEST OPPORTUNITIES</span>
              <h2>Featured jobs</h2>
              <p>Explore some of the latest opportunities on JobHub.</p>
            </div>

            <button onClick={() => navigate("/candidate-login")}>
              Explore jobs →
            </button>
          </div>

          <div className="featured-jobs-grid">
            {featuredJobs.map((job) => (
              <div className="featured-job-card" key={job.title}>
                <div className="featured-job-top">
                  <div className="featured-company-logo">{job.logo}</div>

                  <button className="save-job">♡</button>
                </div>

                <span className="job-type">{job.type}</span>

                <h3>{job.title}</h3>

                <p className="featured-company">{job.company}</p>

                <div className="featured-job-details">
                  <span>📍 {job.location}</span>
                  <span>💰 {job.salary}</span>
                </div>

                <button
                  className="job-apply-button"
                  onClick={() => navigate("/candidate-login")}
                >
                  View & Apply
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="how-heading">
            <span className="section-label">SIMPLE PROCESS</span>
            <h2>How JobHub works</h2>
            <p>
              Everything you need to move from searching for a job to getting
              hired.
            </p>
          </div>

          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon">👤</div>
              <h3>Create your profile</h3>
              <p>
                Build your professional profile with your education,
                experience, skills and resume.
              </p>
            </div>

            <div className="step-line"></div>

            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon">🔎</div>
              <h3>Discover opportunities</h3>
              <p>
                Search and explore jobs based on your preferred role,
                location and experience.
              </p>
            </div>

            <div className="step-line"></div>

            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon">📄</div>
              <h3>Apply with confidence</h3>
              <p>
                Apply to opportunities and keep track of your application
                progress from your dashboard.
              </p>
            </div>

            <div className="step-line"></div>

            <div className="step-card">
              <div className="step-number">04</div>
              <div className="step-icon">🚀</div>
              <h3>Get hired</h3>
              <p>
                Connect with recruiters and move forward toward your next
                career opportunity.
              </p>
            </div>
          </div>
        </section>

        <section className="recruiter-section" id="for-recruiters">
          <div className="recruiter-content">
            <span className="section-label">FOR EMPLOYERS</span>

            <h2>
              Find the people
              <br />
              who move your business forward.
            </h2>

            <p>
              Create your company profile, publish opportunities, manage
              applications, and connect with candidates from one place.
            </p>

            <div className="recruiter-features">
              <div>
                <span>✓</span>
                Post and manage jobs
              </div>
              <div>
                <span>✓</span>
                Review candidate profiles
              </div>
              <div>
                <span>✓</span>
                Track applications
              </div>
              <div>
                <span>✓</span>
                Update candidate status
              </div>
            </div>

            <button
              className="recruiter-cta"
              onClick={() => navigate("/register/recruiter")}
            >
              Start hiring →
            </button>
          </div>

          <div className="recruiter-visual">
            <div className="recruiter-dashboard-card">
              <div className="mini-dashboard-header">
                <div>
                  <span>Recruiter Dashboard</span>
                  <strong>Application Overview</strong>
                </div>
                <div className="mini-avatar">R</div>
              </div>

              <div className="mini-stats">
                <div>
                  <span>Total Jobs</span>
                  <strong>24</strong>
                </div>
                <div>
                  <span>Applications</span>
                  <strong>186</strong>
                </div>
                <div>
                  <span>Hired</span>
                  <strong>18</strong>
                </div>
              </div>

              <div className="mini-chart">
                <div style={{ height: "45%" }}></div>
                <div style={{ height: "65%" }}></div>
                <div style={{ height: "52%" }}></div>
                <div style={{ height: "78%" }}></div>
                <div style={{ height: "70%" }}></div>
                <div style={{ height: "92%" }}></div>
                <div style={{ height: "84%" }}></div>
              </div>
            </div>
          </div>
        </section>

        <section className="faq-section">
          <div className="faq-heading">
            <span className="section-label">FAQ</span>
            <h2>Frequently asked questions</h2>
            <p>Everything you need to know about JobHub.</p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div
                className={`faq-item ${
                  openFaq === index ? "faq-open" : ""
                }`}
                key={faq.question}
              >
                <button
                  onClick={() =>
                    setOpenFaq(openFaq === index ? null : index)
                  }
                >
                  <span>{faq.question}</span>
                  <span>{openFaq === index ? "−" : "+"}</span>
                </button>

                {openFaq === index && <p>{faq.answer}</p>}
              </div>
            ))}
          </div>
        </section>

        <section className="final-cta">
          <div>
            <span className="section-label">YOUR NEXT OPPORTUNITY</span>
            <h2>Ready to take the next step?</h2>
            <p>
              Create your JobHub profile and start exploring opportunities
              today.
            </p>

            <div className="final-cta-buttons">
              <button
                className="primary-cta"
                onClick={() => navigate("/register/candidate")}
              >
                Get Started
              </button>

              <button
                className="secondary-cta"
                onClick={() => navigate("/register/recruiter")}
              >
                I'm Hiring
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="home-logo">
              <div className="logo-mark">J</div>
              <span>JobHub</span>
            </div>

            <p>
              Connecting talented people with opportunities that help them
              grow.
            </p>
          </div>

          <div className="footer-column">
            <h4>For Candidates</h4>
            <button onClick={() => navigate("/candidate-login")}>
              Find Jobs
            </button>
            <button onClick={() => navigate("/register/candidate")}>
              Create Profile
            </button>
            <button onClick={() => navigate("/candidate-login")}>
              My Applications
            </button>
          </div>

          <div className="footer-column">
            <h4>For Recruiters</h4>
            <button onClick={() => navigate("/recruiter-login")}>
              Recruiter Login
            </button>
            <button onClick={() => navigate("/register/recruiter")}>
              Post a Job
            </button>
            <button onClick={() => navigate("/register/recruiter")}>
              Find Candidates
            </button>
          </div>

          <div className="footer-column">
            <h4>JobHub</h4>
            <button onClick={() => navigate("/")}>About Us</button>
            <button
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              How It Works
            </button>
            <button onClick={() => setOpenFaq(0)}>FAQ</button>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 JobHub. All rights reserved.</span>

          <div>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;