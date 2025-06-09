package com.project.humanresource.service;

public interface IEmailVerifacationService {
    void verifyEmail(String token);
    void resendVerificationEmail(String email);

}
