package com.project.humanresource.service;

public interface IEmailVerificationService {
    void verifyEmail(String token);
    void resendVerificationEmail(String email);

}
