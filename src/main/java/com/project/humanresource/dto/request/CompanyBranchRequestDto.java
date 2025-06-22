package com.project.humanresource.dto.request;

public record CompanyBranchRequestDto(
         String branchName,
         String companyBranchAddress,
         String city,
         String companyBranchPhoneNumber,
         String companyBranchEmail
) {
}
