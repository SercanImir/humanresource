package com.project.humanresource.dto.response;

public record JwtResponseDto(
        String token,
        String tokentype,
        String email,
        String role
) {
}
