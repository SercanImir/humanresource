package com.project.humanresource.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.project.humanresource.utility.SubscriptionType;

import java.time.LocalDateTime;

public record PendingCompanyResponseDto(
        Long companyId,
        String companyName,
        String applicantFirstName,
        String applicantLastName,
        String applicantEmail,
        String phoneNumber,
        SubscriptionType subscriptionType,

        // JSON’a ISO‐string olarak yazılması için:
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime registrationDate
) {
}
