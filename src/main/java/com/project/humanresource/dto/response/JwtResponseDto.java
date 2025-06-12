package com.project.humanresource.dto.response;

import java.util.List;

public record JwtResponseDto(
        String token,
        String type,
        String email,
        List<String> role
) {
}
