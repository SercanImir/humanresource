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
        if (companyBranchRepository. existsByCompanyIdAndBranchName(companyId,dto.branchName())) {
            throw new HumanResourceException(ErrorType.COMPANY_BRANCH_NOT_FOUND);
        }


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
        List<CompanyBranch> branches=companyBranchRepository.findByCompanyIdOrderByIsActiveDescBranchNameAsc(companyId);

        return branches.stream()
                .map(this::mapToDto)
                .toList();

    }

    @Override
    public CompanyBranchResponseDto updateBranchById(Long userId, Long id, CompanyBranchRequestDto dto) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(()-> new HumanResourceException(ErrorType.USER_NOT_FOUND));

        Long companyId=employee.getCompanyId();
        CompanyBranch companyBranch=companyBranchRepository.findByIdAndCompanyId(id,companyId)
                        .orElseThrow(()->new HumanResourceException(ErrorType.COMPANY_BRANCH_NOT_FOUND));


        companyBranch.setBranchName(dto.branchName());
        companyBranch.setCompanyBranchAddress(dto.companyBranchAddress());
        companyBranch.setCompanyBranchPhoneNumber(dto.companyBranchPhoneNumber());
        companyBranch.setCompanyBranchEmail(dto.companyBranchEmail());
        companyBranch.setCity(dto.city());
        companyBranchRepository.save(companyBranch);
        return mapToDto(companyBranch);
    }



    @Override
    public void toggleBranchActiveById(Long userId, Long id) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(()-> new HumanResourceException(ErrorType.USER_NOT_FOUND));
        Long companyId=employee.getCompanyId();
        CompanyBranch branch = companyBranchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Branch not found"));
        branch.setActive(!branch.isActive());
        companyBranchRepository.save(branch);
    }

    @Override
    public void deleteBranchById(Long branchId, Long userId) {
        CompanyBranch branch = companyBranchRepository.findById(branchId)
                .orElseThrow(() -> new RuntimeException("Branch not found"));

        // Kullanıcı bu şirkete ait mi?
        if (!branch.getCompanyId().equals(userId)) {
            throw new RuntimeException("Silme yetkiniz yok.");
        }
        companyBranchRepository.deleteById(branchId);
    }

    public CompanyBranchResponseDto mapToDto(CompanyBranch companyBranch) {
        return new CompanyBranchResponseDto(
                companyBranch.getId(),
                companyBranch.getBranchName(),
                companyBranch.getCompanyBranchAddress(),
                companyBranch.getCity(),
                companyBranch.getCompanyBranchPhoneNumber(),
                companyBranch.getCompanyBranchEmail(),
                companyBranch.isActive()


        );
    }
}
