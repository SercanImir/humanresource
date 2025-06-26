package com.project.humanresource.service;

import com.project.humanresource.dto.request.CompanyBranchRequestDto;
import com.project.humanresource.dto.response.CompanyBranchResponseDto;
import com.project.humanresource.entity.CompanyBranch;

import java.util.List;

public interface ICompanyBranchService {
    CompanyBranchResponseDto createBranchByUserId(Long userId, CompanyBranchRequestDto dto);

    List<CompanyBranchResponseDto> getBranchesByUserId(Long userId);

    CompanyBranchResponseDto updateBranchById(Long userId,Long id, CompanyBranchRequestDto dto);

    void toggleBranchActiveById(Long userId, Long id);

    void deleteBranchById(Long branchId, Long userId);
}
