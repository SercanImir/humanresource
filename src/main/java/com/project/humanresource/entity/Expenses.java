package com.project.humanresource.entity;

import com.project.humanresource.utility.ExpensesCategory;
import com.project.humanresource.utility.StateTypes;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tblexpenses")
public class Expenses extends BaseEntity {

    BigDecimal amount;
    String description;
    String documentUrl;

    @Enumerated(EnumType.STRING)
    StateTypes state;

    @Enumerated(EnumType.STRING)
    ExpensesCategory category;

    @NotNull
    Long employeeId;

    LocalDate expenseDate;  //harcamanın tarihi



    Long approvedByUserId;  //  Harcamayı onaylayan  yönetici id'si

    LocalDate approvedAt;   //  onay tarihi

    String rejectionReason; //Red durumunda açıklama


}
