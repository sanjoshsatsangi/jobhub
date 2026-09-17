package com.jobhub.jobhub.repository;

import com.jobhub.jobhub.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByCandidateId(Long candidateId);

    List<Application> findByJobId(Long jobId);

    boolean existsByJobIdAndCandidateId(Long jobId, Long candidateId);
}