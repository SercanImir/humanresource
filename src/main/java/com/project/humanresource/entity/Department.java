package com.project.humanresource.entity;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Department  extends BaseEntity{


    @NotBlank
    String departmentName;
    @NotNull
    Long companyId;


}
