package com.project.humanresource.entity;

import jakarta.persistence.Entity;
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
public class CompanyTitle extends BaseEntity {


    @NotNull
    Long companyId;

    @NotNull
    Long titleId;



}
