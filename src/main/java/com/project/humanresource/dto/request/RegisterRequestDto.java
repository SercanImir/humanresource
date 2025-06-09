package com.project.humanresource.dto.request;

import com.project.humanresource.utility.SubscriptionType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequestDto(
        @NotBlank(message = "First name cannot be blank")
        String firstName,

        @NotBlank(message = "Last name cannot be blank")
        String lastName,

        @Email(message = "Invalid email format")
        @NotBlank(message = "Email cannot be blank")
        String email,

        @Size(min = 8, message = "Password must be at least 8 characters")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
                message = "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one number"
        )
        String password,

        @NotBlank(message = "Please confirm your password")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
                message = "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one number"
        )
        String rePassword,

        @NotBlank(message = "Phone number cannot be blank")
        @Size(min = 11, max = 11)
        String phoneNumber,

        @NotBlank(message = "Company name cannot be blank")
        String companyName,

        SubscriptionType subscriptionType
) {
}
