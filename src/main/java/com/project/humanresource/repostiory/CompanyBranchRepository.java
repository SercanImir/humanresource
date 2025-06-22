package com.project.humanresource.repostiory;

import com.project.humanresource.entity.CompanyBranch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CompanyBranchRepository extends JpaRepository<CompanyBranch, Long> {


    List<CompanyBranch> findAllByCompanyId(Long companyId);
}
