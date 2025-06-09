package com.project.humanresource.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tblbranchdepartment")
public class BranchDepartment extends BaseEntity {

        Long companyBranchId;
        Long departmentId;

}
