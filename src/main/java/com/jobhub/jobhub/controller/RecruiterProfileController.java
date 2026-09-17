package com.jobhub.jobhub.controller;

import com.jobhub.jobhub.entity.RecruiterProfile;
import com.jobhub.jobhub.entity.User;
import com.jobhub.jobhub.repository.UserRepository;
import com.jobhub.jobhub.service.RecruiterProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/recruiter-profile")
@CrossOrigin(origins = "http://localhost:5173")
public class RecruiterProfileController {

    private final RecruiterProfileService profileService;
    private final UserRepository userRepository;

    public RecruiterProfileController(
            RecruiterProfileService profileService,
            UserRepository userRepository) {

        this.profileService = profileService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public RecruiterProfile createOrUpdateProfile(
            @Valid @RequestBody RecruiterProfile profile,
            Principal principal) {

        return profileService.createOrUpdateProfile(
                profile,
                principal.getName()
        );
    }

    @GetMapping
    public ResponseEntity<RecruiterProfile> getMyProfile(
            Principal principal) {

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return profileService.getProfileByUserId(user.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}