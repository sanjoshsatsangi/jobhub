# JobHub

### Talent Meets Opportunity

JobHub is a full-stack job recruitment platform designed to connect candidates and recruiters through a centralized web application. Candidates can create profiles, upload resumes, search and apply for jobs, and track application statuses, while recruiters can manage companies and job postings, review applications, update candidate statuses, and monitor recruitment analytics.

---

## 🚀 Live Demo

**Frontend:** https://jobhub-gilt.vercel.app/

**Backend API:** https://jobhub-production-bf86.up.railway.app/

**GitHub Repository:** https://github.com/sanjoshsatsangi/jobhub

---

## 📌 Features

### 👨‍💻 Candidate

- Candidate registration and login
- JWT-based authentication
- Profile creation and management
- Resume upload and management
- Browse available job opportunities
- Search jobs by title and location
- Apply for jobs
- Track application status
- View applied jobs
- Protected candidate routes

### 🏢 Recruiter

- Recruiter registration and login
- Create and manage companies
- Create, update, and delete job postings
- View applications received for jobs
- Review candidate applications
- Update application status
- View recruitment analytics
- Protected recruiter routes
- Ownership-based authorization

### 🔐 Security

- JWT-based authentication
- Spring Security
- Role-Based Access Control (RBAC)
- Candidate and Recruiter roles
- Ownership-based authorization
- Protected REST API endpoints
- Password protection
- Request validation
- Centralized exception handling
- CORS configuration
- Secure resume upload and retrieval
- File type and file size validation
- Path traversal protection

---

## 🛠️ Tech Stack

### Frontend

- React.js
- JavaScript (ES6+)
- HTML5
- CSS3
- Redux
- Tailwind CSS
- Vite

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Security
- Spring Data JPA
- Hibernate
- REST APIs
- Jakarta Validation
- JWT Authentication

### Database

- MySQL
- JPA/Hibernate ORM
- MySQL Workbench

### Development & Testing

- Maven
- Maven Wrapper
- Postman
- Git
- GitHub
- VS Code

### Deployment

- Vercel — Frontend
- Railway — Backend
- Railway MySQL — Database

---

## 🏗️ Project Architecture

```text
                         ┌──────────────────────┐
                         │      JobHub User     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   React.js Frontend  │
                         │      Vite + UI       │
                         └──────────┬───────────┘
                                    │
                              REST API Calls
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Spring Boot API    │
                         │   Java 21 Backend    │
                         └──────────┬───────────┘
                                    │
                     ┌──────────────┼──────────────┐
                     │              │              │
                     ▼              ▼              ▼
              Spring Security     Services       JPA/
                  + JWT           & Logic       Hibernate
                     │              │              │
                     └──────────────┼──────────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     MySQL Database   │
                         └──────────────────────┘
