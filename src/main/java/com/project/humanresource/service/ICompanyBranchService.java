package com.project.humanresource.service;

import com.project.humanresource.dto.request.CompanyBranchRequestDto;
import com.project.humanresource.dto.response.CompanyBranchResponseDto;

import java.util.List;

public interface ICompanyBranchService {
    CompanyBranchResponseDto createBranchByUserId(Long userId, CompanyBranchRequestDto dto);

    List<CompanyBranchResponseDto> getBranchesByUserId(Long userId);

    CompanyBranchResponseDto updateBranchById(Long userId,Long id, CompanyBranchRequestDto dto);

    CompanyBranchResponseDto toggleBranchActiveById(Long userId, Long id);
}
