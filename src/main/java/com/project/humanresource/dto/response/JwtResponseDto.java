package com.project.humanresource.dto.response;

import java.util.List;

public record JwtResponseDto(
        String token,
        String tokentype,
        String email,
        List<String> role
) {
}
