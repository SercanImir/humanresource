package com.project.humanresource.controller;

import com.project.humanresource.dto.response.*;
import com.project.humanresource.service.IAdminService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AdminController {

   private final IAdminService adminService;



    @GetMapping("/companies/pending")
    public ResponseEntity<BaseResponse<List<PendingCompanyResponseDto>>> listPending() {
        List<PendingCompanyResponseDto> list = adminService.getPendingCompanies();
        return ResponseEntity.ok(
                BaseResponse.<List<PendingCompanyResponseDto>>builder()
                        .code(200)
                        .message("Pending applications retrieved.")
                        .data(list)
                        .build()
        );
    }


    @PostMapping("/companies/{id}/approve")
    public ResponseEntity<BaseResponse<Boolean>> approveCompany(@PathVariable Long id) {
        adminService.approveCompany(id);
        return ResponseEntity.ok(
                BaseResponse.<Boolean>builder()
                        .code(200)
                        .message("Company approved successfully.")
                        .data(true)
                        .build()
        );
    }

    @PostMapping("/companies/{id}/reject")
    public ResponseEntity<BaseResponse<Boolean>> rejectCompany(@PathVariable Long id) {
        adminService.rejectCompany(id);
        return ResponseEntity.ok(BaseResponse.<Boolean>builder()
                        .code(200)
                        .message("Company rejected successfully.")
                        .data(true)
                .build());
    }


    @GetMapping("/companies")
    public ResponseEntity<BaseResponse<List<CompanyListResponseDto>>> listCompanies() {
        List<CompanyListResponseDto> list = adminService.getApprovedCompanies();
        return ResponseEntity.ok(BaseResponse.<List<CompanyListResponseDto>>builder()
                        .code(200)
                        .message("Companies retrieved.")
                        .data(list)
                .build());
    }

    @PostMapping("/companies/{id}/toggle")
    public ResponseEntity<BaseResponse<Boolean>> toggleActiveCompany(@PathVariable Long id) {
        adminService.toggleCompanyActive(id);
        return ResponseEntity.ok(BaseResponse.<Boolean>builder()
                        .code(200)
                .message("Company active successfully.")
                .data(true)
                .build());
    }

    @GetMapping ("/statistics")
    public ResponseEntity<StatisticsResponseDto> getStatictics() {
        StatisticsResponseDto stats=adminService.getStatistics();
        return ResponseEntity.ok(stats);
    }



}
