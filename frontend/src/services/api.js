const API_BASE_URL = "http://localhost:8080/api";

export const api = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Invalid email or password");
    }

    return response.json();
  },

  register: async (user) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    return response.json();
  },

  getJobs: async (token) => {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }

    return response.json();
  },

  getJobById: async (jobId, token) => {
    const response = await fetch(
      `${API_BASE_URL}/jobs/${jobId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    if (!response.ok) {
      throw new Error("Failed to fetch job details");
    }
  
    return response.json();
  },

  searchJobsByTitle: async (title, token) => {
    const response = await fetch(
      `${API_BASE_URL}/jobs/search/title?title=${encodeURIComponent(title)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to search jobs");
    }

    return response.json();
  },

  searchJobsByLocation: async (location, token) => {
    const response = await fetch(
      `${API_BASE_URL}/jobs/search/location?location=${encodeURIComponent(location)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to search jobs by location");
    }

    return response.json();
  },

  applyForJob: async (jobId, token) => {
    const response = await fetch(
      `${API_BASE_URL}/applications?jobId=${jobId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to apply for job");
    }

    return response.json();
  },

  getMyApplications: async (candidateId, token) => {
    const response = await fetch(
      `${API_BASE_URL}/applications/candidate/${candidateId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch applications");
    }

    return response.json();
  },

  getMyProfile: async (token) => {
    const response = await fetch(
      `${API_BASE_URL}/candidate-profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    return response.json();
  },

  getCandidateProfile: async (userId, token) => {
    const response = await fetch(
      `${API_BASE_URL}/candidate-profile/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch candidate profile");
    }

    return response.json();
  },

  saveProfile: async (profile, token) => {
    const response = await fetch(
      `${API_BASE_URL}/candidate-profile`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to save profile");
    }

    return response.json();
  },

  getMyRecruiterProfile: async (token) => {
    const response = await fetch(
      `${API_BASE_URL}/recruiter-profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch recruiter profile");
    }

    return response.json();
  },

  saveRecruiterProfile: async (profile, token) => {
    const response = await fetch(
      `${API_BASE_URL}/recruiter-profile`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        errorText || "Failed to save recruiter profile"
      );
    }

    return response.json();
  },

  getApplicationsByJob: async (jobId, token) => {
    const response = await fetch(
      `${API_BASE_URL}/applications/job/${jobId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch applications");
    }

    return response.json();
  },

  updateApplicationStatus: async (applicationId, status, token) => {
    const response = await fetch(
      `${API_BASE_URL}/applications/${applicationId}/status?status=${status}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        errorText || "Failed to update application status"
      );
    }

    return response.json();
  },

  viewResume: async (resumeUrl, token) => {
    const fileName = resumeUrl.split(/[\\/]/).pop();

    const response = await fetch(
      `${API_BASE_URL}/candidate-profile/resume/${fileName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to load resume");
    }

    const blob = await response.blob();

    return URL.createObjectURL(blob);
  },
};