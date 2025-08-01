package com.project.humanresource.controller;

import com.project.humanresource.config.JwtManager;
import com.project.humanresource.dto.request.CompanyUpdateRequestDto;
import com.project.humanresource.dto.response.BaseResponse;
import com.project.humanresource.dto.response.CompanyResponseDto;
import com.project.humanresource.entity.Employee;
import com.project.humanresource.repostiory.CompanyRepository;
import com.project.humanresource.repostiory.EmployeeRepository;
import com.project.humanresource.service.ICompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class CompanyController {

    private final ICompanyService companyService;
    private final JwtManager jwtManager;
    private final EmployeeRepository employeeRepository;

//

    @PutMapping("/company/me")
    public ResponseEntity<BaseResponse<CompanyResponseDto>> updateOwnCompany(
            @RequestHeader("Authorization") String header,
            @RequestBody CompanyUpdateRequestDto request) {
        String token = header.replace("Bearer", "").trim();
        Long userId = jwtManager.getUserIdFromToken(token);
        CompanyResponseDto responseDto = companyService.updateCompanyByEmployeeUserId(userId, request);
        return ResponseEntity.ok(
                BaseResponse.<CompanyResponseDto>builder()
                        .code(200)
                        .message("Company updated successfully.")
                        .data(responseDto)
                        .build()
        );
    }

    @GetMapping("/company/me")
    public ResponseEntity<BaseResponse<CompanyResponseDto>> getOwnCompany(@RequestHeader("Authorization") String header) {
        String token = header.replace("Bearer", "").trim();
        Long userId = jwtManager.getUserIdFromToken(token);



        CompanyResponseDto dto = companyService.getCompanyByEmployeeUserId(userId);


        return ResponseEntity.ok(BaseResponse.<CompanyResponseDto>builder()
                .code(200)
                .message("Company details fetched successfully.")
                .data(dto)
                .build());
    }



}
