package com.jobhub.jobhub.service;

import com.jobhub.jobhub.entity.Application;
import com.jobhub.jobhub.entity.Job;
import com.jobhub.jobhub.entity.User;
import com.jobhub.jobhub.repository.ApplicationRepository;
import com.jobhub.jobhub.repository.JobRepository;
import com.jobhub.jobhub.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            UserRepository userRepository,
            JobRepository jobRepository) {

        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
    }

    public Application createApplication(
            Long jobId,
            String email,
            Application application) {

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!"CANDIDATE".equals(candidate.getRole())) {
            throw new RuntimeException("Only candidates can apply for jobs");
        }

        if (applicationRepository.existsByJobIdAndCandidateId(
                jobId,
                candidate.getId())) {

            throw new RuntimeException(
                    "You have already applied for this job"
            );
        }

        application.setCandidate(candidate);
        application.setJob(job);
        application.setStatus("APPLIED");

        return applicationRepository.save(application);
    }

    public Optional<Application> getApplicationById(
        Long id,
        String email) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    Application application = applicationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Application not found"));

    if ("CANDIDATE".equals(user.getRole())) {

        if (!application.getCandidate().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You can only access your own application"
            );
        }

    } else if ("RECRUITER".equals(user.getRole())) {

        User companyOwner = application.getJob()
                .getCompany()
                .getOwner();

        if (!companyOwner.getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You do not own the company associated with this application"
            );
        }

    } else {
        throw new RuntimeException("Unauthorized access");
    }

    return Optional.of(application);
    }

    public List<Application> getApplicationsByCandidate(
            Long candidateId,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"CANDIDATE".equals(user.getRole())) {
            throw new RuntimeException(
                    "Only candidates can access candidate applications"
            );
        }

        if (!user.getId().equals(candidateId)) {
            throw new RuntimeException(
                    "You can only access your own applications"
            );
        }

        return applicationRepository.findByCandidateId(candidateId);
    }

    public List<Application> getApplicationsByJob(
        Long jobId,
        String recruiterEmail) {

    User recruiter = userRepository.findByEmail(recruiterEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (!"RECRUITER".equals(recruiter.getRole())) {
        throw new RuntimeException(
                "Only recruiters can access job applications"
        );
    }

    Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new RuntimeException("Job not found"));

    User companyOwner = job.getCompany().getOwner();

    if (!companyOwner.getId().equals(recruiter.getId())) {
        throw new RuntimeException(
                "You do not own the company associated with this job"
        );
    }

    return applicationRepository.findByJobId(jobId);
}
    public Application updateStatus(
            Long id,
            String status,
            String recruiterEmail) {

        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"RECRUITER".equals(recruiter.getRole())) {
            throw new RuntimeException(
                    "Only recruiters can update application status"
            );
        }

        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        User companyOwner = application.getJob()
                .getCompany()
                .getOwner();

        if (!companyOwner.getId().equals(recruiter.getId())) {
            throw new RuntimeException(
                    "You do not own the company associated with this application"
            );
        }

        if (!isValidStatus(status)) {
            throw new RuntimeException("Invalid application status");
        }

        application.setStatus(status.toUpperCase());

        return applicationRepository.save(application);
    }

    private boolean isValidStatus(String status) {

        return status != null &&
                List.of(
                        "APPLIED",
                        "SHORTLISTED",
                        "REJECTED",
                        "INTERVIEW",
                        "HIRED"
                ).contains(status.toUpperCase());
    }


}