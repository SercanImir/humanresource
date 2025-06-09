package com.project.humanresource.entity;

import com.project.humanresource.utility.LeaveTypes;
import com.project.humanresource.utility.StateTypes;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tblleave")
public class Leave extends BaseEntity {


    @NotNull
    LocalDateTime startDate;

    @NotNull
    LocalDateTime endDate;

    @Size(max=250)
    String description;
    @Enumerated(EnumType.STRING)
            @NotNull
    LeaveTypes leaveType;
    @Enumerated(EnumType.STRING)
            @NotNull
    StateTypes state;
    Long employeeId;


    Long approvedByUserId;  // onaylayan kişinin id'si


}
