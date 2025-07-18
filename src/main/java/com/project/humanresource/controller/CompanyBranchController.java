package com.project.humanresource.controller;

import com.project.humanresource.config.JwtManager;
import com.project.humanresource.dto.request.CompanyBranchRequestDto;
import com.project.humanresource.dto.response.BaseResponse;
import com.project.humanresource.dto.response.CompanyBranchResponseDto;
import com.project.humanresource.service.ICompanyBranchService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CompanyBranchController {


    private final JwtManager jwtManager;
    private final ICompanyBranchService companyBranchService;


    @GetMapping("/get-all-branches")
    public ResponseEntity<BaseResponse<List<CompanyBranchResponseDto>>> getAllCompanyBranches(@RequestHeader("Authorization") String header) {
        String token=header.replace("Bearer ", "").trim();
        Long userId = jwtManager.getUserIdFromToken(token);
        List<CompanyBranchResponseDto> dto=companyBranchService.getBranchesByUserId(userId);
        return ResponseEntity.ok(BaseResponse.<List<CompanyBranchResponseDto>>builder()
                        .code(200)
                        .message("Company Branch List")
                        .data(dto)
                .build());
    }

    @PostMapping("/add-branch")
    public ResponseEntity<BaseResponse<CompanyBranchResponseDto>> addBranch(@RequestHeader("Authorization")
                                                                            String header,
                                                                            @RequestBody CompanyBranchRequestDto dto){

        String token=header.replace("Bearer ", "").trim();
        Long userId = jwtManager.getUserIdFromToken(token);
        CompanyBranchResponseDto responseDto=companyBranchService.createBranchByUserId(userId,dto);

        return ResponseEntity.ok(BaseResponse.<CompanyBranchResponseDto>builder()
                        .code(200)
                        .message("Company Branch Created")
                        .data(responseDto)
                .build());

    }


}
