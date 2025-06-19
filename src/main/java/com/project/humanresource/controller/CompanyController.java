package com.project.humanresource.controller;

import com.project.humanresource.config.JwtManager;
import com.project.humanresource.dto.request.CompanyUpdateRequestDto;
import com.project.humanresource.dto.response.BaseResponse;
import com.project.humanresource.dto.response.CompanyResponseDto;
import com.project.humanresource.repostiory.CompanyRepository;
import com.project.humanresource.service.ICompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/manager/company")
@RequiredArgsConstructor
public class CompanyController {

    private final ICompanyService companyService;
    private final JwtManager jwtManager;

    @GetMapping("/{companyId}")
    public ResponseEntity<BaseResponse<CompanyResponseDto>> getCompanyById(@PathVariable Long companyId) {
        CompanyResponseDto dto = companyService.getCompanyId(companyId);
        return ResponseEntity.ok(
                BaseResponse.<CompanyResponseDto>builder()
                        .code(200)
                        .message("Company details fetched successfully.")
                        .data(dto)
                        .build()
        );
    }

    @PutMapping("/me")
    public ResponseEntity<BaseResponse<CompanyResponseDto>> updateOwnCompany(
            @RequestHeader("Authorization") String header,
            @RequestBody CompanyUpdateRequestDto request) {
        String token = header.replace("Bearer", "");
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

    @GetMapping("/me")
    public ResponseEntity<BaseResponse<CompanyResponseDto>> getOwnCompany(@RequestHeader("Authorization") String header) {
       String token=header.replace("Bearer","");
       Long userId=jwtManager.getUserIdFromToken(token);

       CompanyResponseDto dto=companyService.getCompanyByEmployeeUserId(userId);

       return ResponseEntity.ok(BaseResponse.<CompanyResponseDto>builder()
                       .code(200)
                       .message("Company details fetched successfully.")
                       .data(dto)
               .build());
    }



}
