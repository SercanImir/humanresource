package com.project.humanresource.dto.response;

public record CompanyBranchResponseDto(
        Long id,
        String branchName,
        String companyBranchAddress,
        String city,
        String companyBranchPhoneNumber,
        String companyBranchEmail,

        boolean active) {
}
