package com.project.humanresource.dto.response;

public record CompanyBranchResponseDto(
        Long id,
        String branchName,
        String companyBranchAdress,
        String city,
        String companyBranchPhoneNumber,
        String companyBranchEmail

) {
}
