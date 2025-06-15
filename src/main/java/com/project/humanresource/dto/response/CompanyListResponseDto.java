package com.project.humanresource.dto.response;

import com.project.humanresource.utility.SubscriptionType;

import java.time.LocalDateTime;

public record CompanyListResponseDto (
        Long id,
        String companyName,
        String companyPhoneNumber,
        String applicantFirstName,
        String applicantLastName,
        String applicantEmail,
        String applicantAddress,
        SubscriptionType subscriptionType,
        LocalDateTime subscriptionStart,
        LocalDateTime subscriptionEnd,
        LocalDateTime registrationDate,
        boolean active
){
}
