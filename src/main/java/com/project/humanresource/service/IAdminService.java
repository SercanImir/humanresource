package com.project.humanresource.service;

import com.project.humanresource.dto.request.PendingCompanyResponseDto;
import com.project.humanresource.dto.response.CompanyResponseDto;
import org.springframework.stereotype.Service;

import java.util.List;


public interface IAdminService {
    void approveUser(Long id);

    List<PendingCompanyResponseDto> getPendingCompanies();
    void approveCompany(Long companyId);
}
