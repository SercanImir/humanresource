package com.project.humanresource.service;

import com.project.humanresource.dto.request.RegisterRequestDto;
import com.project.humanresource.dto.response.JwtResponseDto;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements IAuthService {
    @Override
    public void register(RegisterRequestDto dto) {

    }

    @Override
    public void verifyEmail(String token) {

    }

    @Override
    public JwtResponseDto login(String email, String password) {
        return null;
    }
}
