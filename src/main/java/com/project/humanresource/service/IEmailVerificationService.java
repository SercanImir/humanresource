package com.project.humanresource.service;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public interface IEmailVerificationService {
    void verifyEmail(String token);
    void resendVerificationEmail(String email);

    void sendDecisionEmail(@NotBlank @Size(min = 6) String email, @NotBlank String companyName, boolean b);
}
