package com.project.humanresource.entity;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class CompanyBranch extends BaseEntity {


    @NotBlank
    String branchName;

    String companyBranchAddress;

    @Pattern(regexp = "^\\d{11}$")
    String companyBranchPhoneNumber;

    String companyBranchEmail;


    @NotNull
     Long companyId;



}
