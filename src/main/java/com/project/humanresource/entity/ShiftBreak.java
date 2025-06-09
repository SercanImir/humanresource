package com.project.humanresource.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
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
@Table(name = "tblshiftbreak")
public class ShiftBreak extends BaseEntity {

    LocalDateTime startTime;
    LocalDateTime endTime;


}
