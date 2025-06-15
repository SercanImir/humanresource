package com.project.humanresource.service;

import com.project.humanresource.dto.request.CompanyUpdateRequestDto;
import com.project.humanresource.dto.response.CompanyListResponseDto;
import com.project.humanresource.dto.response.PendingCompanyResponseDto;
import com.project.humanresource.dto.response.StatisticsResponseDto;
import com.project.humanresource.entity.Company;

import java.util.List;


public interface IAdminService {

    List<PendingCompanyResponseDto> getPendingCompanies();
    void approveCompany(Long companyId);

    void rejectCompany(Long id);

    List<CompanyListResponseDto> getApprovedCompanies();
    //CompanyListResponseDto updateCompany(Long companyId, CompanyUpdateRequestDto companyUpdateRequestDto);,



    void toggleCompanyActive(Long companyId);

    StatisticsResponseDto getStatistics();
}
