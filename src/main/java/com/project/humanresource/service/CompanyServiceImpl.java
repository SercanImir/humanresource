package com.project.humanresource.service;

import com.project.humanresource.dto.request.CompanyUpdateRequestDto;
import com.project.humanresource.dto.response.CompanyResponseDto;
import com.project.humanresource.entity.Company;
import com.project.humanresource.entity.Employee;
import com.project.humanresource.entity.User;
import com.project.humanresource.exception.ErrorType;
import com.project.humanresource.exception.HumanResourceException;
import com.project.humanresource.repostiory.CompanyRepository;
import com.project.humanresource.repostiory.EmployeeRepository;
import com.project.humanresource.utility.SubscriptionType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements ICompanyService{
    private final EmployeeRepository employeeRepository;

    final CompanyRepository companyRepository;
    @Override
    public CompanyResponseDto getCompanyId(Long companyId) {
        Company company=companyRepository.findById(companyId)
                .orElseThrow(()-> new HumanResourceException(ErrorType.COMMENT_NOT_FOUND));
        return mapDto(company);
    }



    @Override
    public CompanyResponseDto updateCompanyByEmployeeUserId(Long userId, CompanyUpdateRequestDto dto) {
        Employee employee=employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new HumanResourceException(ErrorType.USER_NOT_FOUND));
        Company company=companyRepository.findById(employee.getCompanyId())
                .orElseThrow(() -> new HumanResourceException(ErrorType.COMPANY_NOT_FOUND));
        company.setCompanyName(dto.companyName());
        company.setCompanyAddress(dto.address());
        company.setCompanyPhoneNumber(dto.companyPhoneNumber());
        company.setCity(dto.city());
        company.setTaxNo(dto.taxNo());
        company.setFoundationDate(dto.foundationDate());
        companyRepository.save(company);
        return mapDto(company);
    }

    private CompanyResponseDto mapDto(Company company) {
        return new CompanyResponseDto(
                company.getId(),
                company.getCompanyName(),
                company.getCompanyEmail(),
                company.getCompanyPhoneNumber(),
                company.getSubscriptionType(),
                company.getSubscriptionStart(),
                company.getSubscriptionEnd(),
                company.getCity(),
                company.getTaxNo(),
                company.getFoundationDate()

        );
    }

    public CompanyResponseDto getCompanyByEmployeeUserId(Long userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new HumanResourceException(ErrorType.USER_NOT_FOUND));
        Company company = companyRepository.findById(employee.getCompanyId())
                .orElseThrow(() -> new HumanResourceException(ErrorType.COMMENT_NOT_FOUND));
        return mapDto(company); // Senin mevcut Company -> CompanyResponseDto methodun
    }



}
