package com.project.humanresource.dto.response;

import com.project.humanresource.utility.UserStatus;

import java.util.List;

public record JwtResponseDto(
        String token,
        String email,
        List<UserStatus> roles

) {
}
