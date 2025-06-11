package com.project.humanresource.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@SuperBuilder
@Table(name = "tbl_employee")

public class Employee extends BaseEntity {

    @NotBlank
    String firstName;

    @NotBlank
    String lastName;


    LocalDate hireDate;

    @NotNull
    Long companyId;

    @NotNull
    Long titleId;

    Long branchId;
    Long departmentId;
    Long userId;










}
