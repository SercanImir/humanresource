package com.project.humanresource.entity;

import com.project.humanresource.utility.BloodType;
import com.project.humanresource.utility.EducationLevel;
import com.project.humanresource.utility.Gender;
import com.project.humanresource.utility.MaritalStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tblpersonelfile")
public class PersonalFile extends  BaseEntity{


    @Enumerated(EnumType.STRING)
    Gender gender;

    @Past
    Date birthdate;
    @Pattern(regexp = "^\\d{11}$")
    String personalPhone;
    @Email
    String personalEmail;
    @Column(length = 11,unique=true)
    String nationalId;

    @Enumerated(EnumType.STRING)
    EducationLevel educationLevel;
    @Enumerated(EnumType.STRING)
    MaritalStatus maritalStatus;
    @Enumerated(EnumType.STRING)
    BloodType bloodType;

    Byte numberOfChildren;
    String address;
    String city;
    @Size(min=26,max=26)
    String iban;
    String bankName;
    String bankAccountNumber;
    String bankAccountType;

    @NotNull
    Long employeeId;

    LocalDateTime createAt=LocalDateTime.now();





}
