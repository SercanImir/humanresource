package com.project.humanresource.service;

import com.project.humanresource.dto.request.CompanyUpdateRequestDto;
import com.project.humanresource.dto.response.CompanyResponseDto;

public interface ICompanyService {
    CompanyResponseDto getCompanyId(Long companyId);


    CompanyResponseDto getCompanyByEmployeeUserId(Long userId);

    CompanyResponseDto updateCompanyByEmployeeUserId(Long userId, CompanyUpdateRequestDto request);
}
