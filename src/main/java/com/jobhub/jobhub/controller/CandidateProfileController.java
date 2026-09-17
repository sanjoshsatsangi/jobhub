package com.jobhub.jobhub.controller;

import com.jobhub.jobhub.entity.CandidateProfile;
import com.jobhub.jobhub.entity.User;
import com.jobhub.jobhub.repository.UserRepository;
import com.jobhub.jobhub.service.CandidateProfileService;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;

@RestController
@RequestMapping("/api/candidate-profile")
@CrossOrigin(origins = "http://localhost:5173")
public class CandidateProfileController {

    private final CandidateProfileService profileService;
    private final UserRepository userRepository;

    public CandidateProfileController(
            CandidateProfileService profileService,
            UserRepository userRepository) {

        this.profileService = profileService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public CandidateProfile createOrUpdateProfile(
            @Valid @RequestBody CandidateProfile profile,
            Principal principal) {

        return profileService.createOrUpdateProfile(
                profile,
                principal.getName()
        );
    }

    @GetMapping
    public ResponseEntity<CandidateProfile> getMyProfile(
            Principal principal) {

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return profileService.getProfileByUserId(user.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<CandidateProfile> getCandidateProfile(
            @PathVariable Long userId,
            Principal principal) {

        User recruiter = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"RECRUITER".equals(recruiter.getRole())) {
            return ResponseEntity.status(403).build();
        }

        return profileService.getProfileByUserIdForRecruiter(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/resume")
    public ResponseEntity<String> uploadResume(
            @RequestParam("file") MultipartFile file,
            Principal principal) {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Please select a resume file");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest()
                    .body("Resume file must be smaller than 5 MB");
        }

        String contentType = file.getContentType();

        if (!"application/pdf".equalsIgnoreCase(contentType)) {
            return ResponseEntity.badRequest()
                    .body("Only PDF files are allowed");
        }

        String originalFileName = file.getOriginalFilename();

        if (originalFileName == null ||
                !originalFileName.toLowerCase().endsWith(".pdf")) {
            return ResponseEntity.badRequest()
                    .body("Only PDF files are allowed");
        }

        try {
            String resumePath = profileService.saveResume(
                    file,
                    principal.getName()
            );

            return ResponseEntity.ok(resumePath);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/resume/{fileName}")
    public ResponseEntity<Resource> getResume(
            @PathVariable String fileName) {

        try {
            Path resumeDirectory = Paths.get("uploads/resumes")
                    .toAbsolutePath()
                    .normalize();

            Path filePath = resumeDirectory
                    .resolve(fileName)
                    .normalize();

            if (!filePath.startsWith(resumeDirectory)) {
                return ResponseEntity.badRequest().build();
            }

            if (!fileName.toLowerCase().endsWith(".pdf")) {
                return ResponseEntity.badRequest().build();
            }

            Resource resource = new UrlResource(
                    filePath.toUri()
            );

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + resource.getFilename() + "\""
                    )
                    .header(
                            HttpHeaders.CONTENT_TYPE,
                            "application/pdf"
                    )
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
