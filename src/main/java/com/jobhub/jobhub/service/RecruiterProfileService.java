package com.jobhub.jobhub.service;

import com.jobhub.jobhub.entity.RecruiterProfile;
import com.jobhub.jobhub.entity.User;
import com.jobhub.jobhub.repository.RecruiterProfileRepository;
import com.jobhub.jobhub.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RecruiterProfileService {

    private final RecruiterProfileRepository profileRepository;
    private final UserRepository userRepository;

    public RecruiterProfileService(
            RecruiterProfileRepository profileRepository,
            UserRepository userRepository) {

        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    public RecruiterProfile createOrUpdateProfile(
            RecruiterProfile profile,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"RECRUITER".equals(user.getRole())) {
            throw new RuntimeException(
                    "Only recruiters can create profiles"
            );
        }

        Optional<RecruiterProfile> existingProfile =
                profileRepository.findByUserId(user.getId());

        RecruiterProfile recruiterProfile;

        if (existingProfile.isPresent()) {
            recruiterProfile = existingProfile.get();
        } else {
            recruiterProfile = new RecruiterProfile();
            recruiterProfile.setUser(user);
        }

        recruiterProfile.setCompany(profile.getCompany());
        recruiterProfile.setPhone(profile.getPhone());
        recruiterProfile.setLocation(profile.getLocation());
        recruiterProfile.setWebsite(profile.getWebsite());
        recruiterProfile.setAbout(profile.getAbout());

        return profileRepository.save(recruiterProfile);
    }

    public Optional<RecruiterProfile> getProfileByUserId(Long userId) {
        return profileRepository.findByUserId(userId);
    }
}