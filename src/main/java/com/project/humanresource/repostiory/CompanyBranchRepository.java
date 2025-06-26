package com.project.humanresource.repostiory;

import com.project.humanresource.entity.CompanyBranch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CompanyBranchRepository extends JpaRepository<CompanyBranch, Long> {








    Optional<CompanyBranch> findByIdAndCompanyId(Long id, Long companyId);

    boolean existsByCompanyIdAndBranchName(Long companyId, String s);

    List<CompanyBranch> findByCompanyIdOrderByIsActiveDescBranchNameAsc(Long companyId);
}
