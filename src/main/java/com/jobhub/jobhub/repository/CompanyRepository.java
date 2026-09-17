package com.jobhub.jobhub.repository;

import com.jobhub.jobhub.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Long> {
}