package com.project.humanresource.service;


import com.project.humanresource.dto.request.CompanyBranchRequestDto;
import com.project.humanresource.dto.response.CompanyBranchResponseDto;
import com.project.humanresource.entity.CompanyBranch;
import com.project.humanresource.entity.Employee;
import com.project.humanresource.exception.ErrorType;
import com.project.humanresource.exception.HumanResourceException;
import com.project.humanresource.repostiory.CompanyBranchRepository;
import com.project.humanresource.repostiory.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyBranchServiceImpl implements ICompanyBranchService {
    private final EmployeeRepository employeeRepository;
    private final CompanyBranchRepository companyBranchRepository;

    @Override
    public CompanyBranchResponseDto createBranchByUserId(Long userId, CompanyBranchRequestDto dto) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(()-> new HumanResourceException(ErrorType.USER_NOT_FOUND));

        Long companyId=employee.getCompanyId();

        CompanyBranch branch= CompanyBranch.builder()
                .branchName(dto.branchName())
                .companyBranchAddress(dto.companyBranchAddress())
                .companyBranchPhoneNumber(dto.companyBranchPhoneNumber())
                .companyBranchEmail(dto.companyBranchEmail())
                .city(dto.city())
                .companyId(companyId)
                .build();
        companyBranchRepository.save(branch);

         return mapToDto(branch);
    }

    @Override
    public List<CompanyBranchResponseDto> getBranchesByUserId(Long userId) {
         Employee employee=employeeRepository.findByUserId(userId)
                 .orElseThrow(()-> new HumanResourceException(ErrorType.USER_NOT_FOUND));

         Long companyId=employee.getCompanyId();

         //Şirketin şubelerini getir.
        List<CompanyBranch> branches=companyBranchRepository.findAllByCompanyId(companyId);

        return branches.stream()
                .map(this::mapToDto)
                .toList();

    }

    public CompanyBranchResponseDto mapToDto(CompanyBranch companyBranch) {
        return new CompanyBranchResponseDto(
                companyBranch.getId(),
                companyBranch.getBranchName(),
                companyBranch.getCompanyBranchAddress(),
                companyBranch.getCity(),
                companyBranch.getCompanyBranchPhoneNumber(),
                companyBranch.getCompanyBranchEmail()


        );
    }
}
