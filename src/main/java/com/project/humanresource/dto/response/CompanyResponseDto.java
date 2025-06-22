package com.project.humanresource.dto.response;

import com.project.humanresource.utility.SubscriptionType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record CompanyResponseDto(
        Long id,
        String companyName,
        String companyEmail,
        String companyPhoneNumber,
        String companyAddress,
        String city,
        String taxNo,
        LocalDate foundationDate,
        SubscriptionType subscriptionType,
        LocalDateTime subscriptionStart,
        LocalDateTime subscriptionEnd
) {
}
