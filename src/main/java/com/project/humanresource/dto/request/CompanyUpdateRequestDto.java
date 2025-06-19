package com.project.humanresource.dto.request;

import com.project.humanresource.utility.SubscriptionType;

import java.time.LocalDateTime;

public record CompanyUpdateRequestDto(
        String companyName,
        String companyPhoneNumber,
        String applicantFirstName,
        String applicantLastName,
        String applicantEmail,
        SubscriptionType subscriptionType,
        LocalDateTime subscriptionStart,
        LocalDateTime subscriptionEnd,
        String taxNo,
        String address,
        String city,
        LocalDateTime foundationDate
) {
}
