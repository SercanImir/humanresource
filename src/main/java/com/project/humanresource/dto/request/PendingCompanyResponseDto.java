package com.project.humanresource.dto.request;

import com.project.humanresource.utility.SubscriptionType;

import java.time.LocalDateTime;

public record PendingCompanyResponseDto(
        Long companyId,
        String companyName,
        String applicantFirstName,
        String applicantLastName,
        String applicantEmail,
        SubscriptionType subscriptionType,
        LocalDateTime registrationDate
) {
}
