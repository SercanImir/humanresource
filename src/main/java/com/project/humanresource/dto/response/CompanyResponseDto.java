package com.project.humanresource.dto.response;

import com.project.humanresource.utility.SubscriptionType;

import java.time.LocalDateTime;

public record CompanyResponseDto(
        Long id,
        String companyName,
        String email,
        String phoneNumber,
        SubscriptionType subscriptionType,
        LocalDateTime subscriptionStart,
        LocalDateTime subscriptionEnd
) {
}
