package com.project.humanresource.service;

import com.project.humanresource.dto.request.LoginRequestDto;
import com.project.humanresource.dto.request.RegisterRequestDto;
import com.project.humanresource.dto.response.JwtResponseDto;

public interface IAuthService {
    void register(RegisterRequestDto dto);
    void verifyEmail(String token);
    JwtResponseDto login(LoginRequestDto dto);
}
