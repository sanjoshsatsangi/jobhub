package com.jobhub.jobhub.service;

import com.jobhub.jobhub.entity.CandidateProfile;
import com.jobhub.jobhub.entity.User;
import com.jobhub.jobhub.repository.CandidateProfileRepository;
import com.jobhub.jobhub.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

@Service
public class CandidateProfileService {

    private final CandidateProfileRepository profileRepository;
    private final UserRepository userRepository;

    private final Path resumeDirectory =
            Paths.get("uploads/resumes").toAbsolutePath().normalize();

    public CandidateProfileService(
            CandidateProfileRepository profileRepository,
            UserRepository userRepository) {

        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    public CandidateProfile createOrUpdateProfile(
            CandidateProfile profile,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"CANDIDATE".equals(user.getRole())) {
            throw new RuntimeException("Only candidates can create profiles");
        }

        Optional<CandidateProfile> existingProfile =
                profileRepository.findByUserId(user.getId());

        CandidateProfile candidateProfile;

        if (existingProfile.isPresent()) {
            candidateProfile = existingProfile.get();
        } else {
            candidateProfile = new CandidateProfile();
            candidateProfile.setUser(user);
        }

        candidateProfile.setPhone(profile.getPhone());
        candidateProfile.setLocation(profile.getLocation());
        candidateProfile.setEducation(profile.getEducation());
        candidateProfile.setExperience(profile.getExperience());

        if (profile.getResumeUrl() != null &&
                !profile.getResumeUrl().isBlank()) {
            candidateProfile.setResumeUrl(profile.getResumeUrl());
        }

        candidateProfile.setAbout(profile.getAbout());

        return profileRepository.save(candidateProfile);
    }

    public Optional<CandidateProfile> getProfileByUserId(Long userId) {
        return profileRepository.findByUserId(userId);
    }

    public Optional<CandidateProfile> getProfileByUserIdForRecruiter(Long userId) {
        return profileRepository.findByUserId(userId);
    }

    public String saveResume(
            MultipartFile file,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"CANDIDATE".equals(user.getRole())) {
            throw new RuntimeException(
                    "Only candidates can upload resumes"
            );
        }

        validateResume(file);

        try {
            Files.createDirectories(resumeDirectory);

            CandidateProfile profile = profileRepository
                    .findByUserId(user.getId())
                    .orElseGet(() -> {
                        CandidateProfile newProfile =
                                new CandidateProfile();

                        newProfile.setUser(user);

                        return newProfile;
                    });

            String oldResumeUrl = profile.getResumeUrl();

            String fileName =
                    UUID.randomUUID().toString() + ".pdf";

            Path filePath =
                    resumeDirectory.resolve(fileName).normalize();

            if (!filePath.startsWith(resumeDirectory)) {
                throw new RuntimeException(
                        "Invalid resume file path"
                );
            }

            Files.write(filePath, file.getBytes());

            profile.setResumeUrl(
                    "uploads/resumes/" + fileName
            );

            profileRepository.save(profile);

            deleteOldResume(oldResumeUrl, fileName);

            return "uploads/resumes/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException(
                    "Failed to save resume"
            );
        }
    }

    private void validateResume(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Please select a resume file"
            );
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException(
                    "Resume file must be smaller than 5 MB"
            );
        }

        String contentType = file.getContentType();

        if (!"application/pdf".equalsIgnoreCase(contentType)) {
            throw new IllegalArgumentException(
                    "Only PDF files are allowed"
            );
        }

        String originalFileName =
                file.getOriginalFilename();

        if (originalFileName == null ||
                !originalFileName
                        .toLowerCase()
                        .endsWith(".pdf")) {

            throw new IllegalArgumentException(
                    "Only PDF files are allowed"
            );
        }
    }

    private void deleteOldResume(
            String oldResumeUrl,
            String newFileName) {

        if (oldResumeUrl == null ||
                oldResumeUrl.isBlank()) {
            return;
        }

        try {
            String oldFileName =
                    Paths.get(oldResumeUrl)
                            .getFileName()
                            .toString();

            if (oldFileName.equals(newFileName)) {
                return;
            }

            if (!oldFileName.toLowerCase().endsWith(".pdf")) {
                return;
            }

            Path oldFilePath =
                    resumeDirectory
                            .resolve(oldFileName)
                            .normalize();

            if (!oldFilePath.startsWith(resumeDirectory)) {
                return;
            }

            Files.deleteIfExists(oldFilePath);

        } catch (Exception ignored) {
        }
    }
}