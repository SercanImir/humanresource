package com.project.humanresource.dto.request;

import com.project.humanresource.utility.SubscriptionType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record CompanyUpdateRequestDto(
        String companyName,
        String companyPhoneNumber,
        String applicantFirstName,
        String applicantLastName,
        String companyEmail,
        SubscriptionType subscriptionType,
        LocalDateTime subscriptionStart,
        LocalDateTime subscriptionEnd,
        String taxNo,
        String city,
        LocalDate foundationDate,
        String companyAddress
) {
}
