package com.project.humanresource.dto.response;

public record StatisticsResponseDto(
        long totalCompanies,
        long totalManagers,
        long totalEmployes
) {
}
