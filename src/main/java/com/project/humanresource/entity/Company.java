package com.project.humanresource.entity;

import com.project.humanresource.utility.SubscriptionType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Company extends BaseEntity {

    @NotBlank
    String companyName;

    String companyAddress;

    @NotBlank
    @Pattern(regexp = "^\\d{11}$")
    String companyPhoneNumber;
    @Email
    @Column(unique = true)
    String companyEmail;

    boolean isVerified = false;

    @Enumerated(EnumType.STRING)
    SubscriptionType subscriptionType; // örn: "Aylık", "Yıllık"

    private LocalDateTime subscriptionStart;  // aktif olduğu tarih
    private LocalDateTime subscriptionEnd;    // bitiş tarihi




}


