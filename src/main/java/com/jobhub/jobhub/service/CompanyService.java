package com.jobhub.jobhub.service;

import com.jobhub.jobhub.entity.Company;
import com.jobhub.jobhub.entity.User;
import com.jobhub.jobhub.repository.CompanyRepository;
import com.jobhub.jobhub.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public CompanyService(
            CompanyRepository companyRepository,
            UserRepository userRepository) {

        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    public Company createCompany(Company company, String email) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"RECRUITER".equals(owner.getRole())) {
            throw new RuntimeException("Only recruiters can create companies");
        }

        company.setOwner(owner);

        return companyRepository.save(company);
    }

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public Optional<Company> getCompanyById(Long id) {
        return companyRepository.findById(id);
    }

    public void deleteCompany(Long id, String email) {

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        if (!company.getOwner().getId().equals(recruiter.getId())) {
            throw new RuntimeException("You do not own this company");
        }

        companyRepository.delete(company);
    }
}