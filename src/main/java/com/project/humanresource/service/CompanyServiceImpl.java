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

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements ICompanyService{
    private final EmployeeRepository employeeRepository;

    final CompanyRepository companyRepository;
//



    @Override
    public CompanyResponseDto updateCompanyByEmployeeUserId(Long userId, CompanyUpdateRequestDto dto) {
        Employee employee=employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new HumanResourceException(ErrorType.USER_NOT_FOUND));
        Company company=companyRepository.findById(employee.getCompanyId())
                .orElseThrow(() -> new HumanResourceException(ErrorType.COMPANY_NOT_FOUND));
        company.setCompanyName(dto.companyName());
        company.setCompanyAddress(dto.companyAddress());
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
                company.getCompanyAddress(),
                company.getCity(),
                company.getTaxNo(),
                company.getFoundationDate(),
                company.getSubscriptionType(),
                company.getSubscriptionStart(),
                company.getSubscriptionEnd()

        );
    }

    public CompanyResponseDto getCompanyByEmployeeUserId(Long userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> {
                    System.out.println("EMPLOYEE YOK!!! userId: " + userId);
                    return new HumanResourceException(ErrorType.USER_NOT_FOUND);
                });
        System.out.println("Bulunan employee: " + employee);

        Company company = companyRepository.findById(employee.getCompanyId())
                .orElseThrow(() -> {
                    System.out.println("COMPANY YOK!!! id: " + employee.getCompanyId());
                    return new HumanResourceException(ErrorType.COMMENT_NOT_FOUND);
                });
        System.out.println("Bulunan company: " + company);

        return mapDto(company);
    }



}
