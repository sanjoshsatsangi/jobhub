package com.jobhub.jobhub.service;

import com.jobhub.jobhub.entity.Company;
import com.jobhub.jobhub.entity.Job;
import com.jobhub.jobhub.entity.User;
import com.jobhub.jobhub.repository.CompanyRepository;
import com.jobhub.jobhub.repository.JobRepository;
import com.jobhub.jobhub.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public JobService(
            JobRepository jobRepository,
            CompanyRepository companyRepository,
            UserRepository userRepository) {

        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    public Job createJob(
            Job job,
            Long companyId,
            String email) {

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"RECRUITER".equals(recruiter.getRole())) {
            throw new RuntimeException("Only recruiters can create jobs");
        }

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        if (!company.getOwner().getId().equals(recruiter.getId())) {
            throw new RuntimeException("You do not own this company");
        }

        job.setCompany(company);

        return jobRepository.save(job);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Optional<Job> getJobById(Long id) {
        return jobRepository.findById(id);
    }

    public List<Job> searchByTitle(String title) {
        return jobRepository.findByTitleContainingIgnoreCase(title);
    }

    public List<Job> searchByLocation(String location) {
        return jobRepository.findByLocationContainingIgnoreCase(location);
    }

    public void deleteJob(Long id, String email) {

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getCompany().getOwner().getId().equals(recruiter.getId())) {
            throw new RuntimeException("You do not own this job");
        }

        jobRepository.delete(job);
    }
    public Job updateJob(
        Long id,
        Job updatedJob,
        String email) {

    User recruiter = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (!"RECRUITER".equals(recruiter.getRole())) {
        throw new RuntimeException("Only recruiters can update jobs");
    }

    Job existingJob = jobRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Job not found"));

    if (!existingJob.getCompany().getOwner().getId().equals(recruiter.getId())) {
        throw new RuntimeException("You do not own this job");
    }

    existingJob.setTitle(updatedJob.getTitle());
    existingJob.setDescription(updatedJob.getDescription());
    existingJob.setLocation(updatedJob.getLocation());
    existingJob.setEmploymentType(updatedJob.getEmploymentType());
    existingJob.setSalaryMin(updatedJob.getSalaryMin());
    existingJob.setSalaryMax(updatedJob.getSalaryMax());
    existingJob.setExperienceMin(updatedJob.getExperienceMin());
    existingJob.setExperienceMax(updatedJob.getExperienceMax());

    return jobRepository.save(existingJob);
    }
}