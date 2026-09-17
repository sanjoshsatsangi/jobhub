package com.jobhub.jobhub.controller;

import com.jobhub.jobhub.entity.Application;
import com.jobhub.jobhub.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public Application createApplication(
            @RequestParam Long jobId,
            @RequestBody Application application,
            Principal principal) {

        return applicationService.createApplication(
                jobId,
                principal.getName(),
                application
        );
    }



    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplicationById(
            @PathVariable Long id,
            Principal principal) {
    
        return applicationService.getApplicationById(
                id,
                principal.getName()
        ).map(ResponseEntity::ok)
         .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/candidate/{candidateId}")
    public List<Application> getApplicationsByCandidate(
            @PathVariable Long candidateId,
            Principal principal) {
    
        return applicationService.getApplicationsByCandidate(
                candidateId,
                principal.getName()
        );
    }

    @GetMapping("/job/{jobId}")
    public List<Application> getApplicationsByJob(
            @PathVariable Long jobId,
            Principal principal) {
    
        return applicationService.getApplicationsByJob(
                jobId,
                principal.getName()
        );
    }

    @PutMapping("/{id}/status")
    public Application updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            Principal principal) {

        return applicationService.updateStatus(
                id,
                status,
                principal.getName()
        );
    }


}