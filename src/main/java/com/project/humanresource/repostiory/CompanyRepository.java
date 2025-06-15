package com.project.humanresource.repostiory;

import com.project.humanresource.entity.Company;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByCompanyName(String companyName );

    List<Company> findAllByIsVerifiedFalse();

    List<Company> findAllByIsActiveTrue();


    long countByIsVerifiedTrue();
}
