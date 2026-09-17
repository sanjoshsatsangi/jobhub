package com.jobhub.jobhub.service;

import com.jobhub.jobhub.entity.User;
import com.jobhub.jobhub.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> login(String email, String password) {

        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent() &&
                passwordEncoder.matches(password, user.get().getPassword())) {

            return user;
        }

        return Optional.empty();
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public String generateToken(User user) {
        return jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );
    }
}