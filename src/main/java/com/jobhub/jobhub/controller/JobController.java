package com.jobhub.jobhub.controller;

import com.jobhub.jobhub.entity.Job;
import com.jobhub.jobhub.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:5173")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    public Job createJob(
            @Valid @RequestBody Job job,
            @RequestParam Long companyId,
            Principal principal) {

        return jobService.createJob(
                job,
                companyId,
                principal.getName()
        );
    }

    @GetMapping
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    @GetMapping("/search/title")
    public List<Job> searchByTitle(
            @RequestParam String title) {

        return jobService.searchByTitle(title);
    }

    @GetMapping("/search/location")
    public List<Job> searchByLocation(
            @RequestParam String location) {

        return jobService.searchByLocation(location);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(
            @PathVariable Long id) {

        return jobService.getJobById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public Job updateJob(
            @PathVariable Long id,
            @Valid @RequestBody Job job,
            Principal principal) {

        return jobService.updateJob(
                id,
                job,
                principal.getName()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(
            @PathVariable Long id,
            Principal principal) {

        jobService.deleteJob(
                id,
                principal.getName()
        );

        return ResponseEntity.noContent().build();
    }
}