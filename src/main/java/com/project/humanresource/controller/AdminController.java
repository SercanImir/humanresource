package com.project.humanresource.controller;

import com.project.humanresource.dto.request.PendingCompanyResponseDto;
import com.project.humanresource.dto.response.BaseResponse;
import com.project.humanresource.entity.Company;
import com.project.humanresource.entity.User;
import com.project.humanresource.exception.ErrorType;
import com.project.humanresource.exception.HumanResourceException;
import com.project.humanresource.repostiory.CompanyRepository;
import com.project.humanresource.service.IAdminService;
import com.project.humanresource.service.IUserRoleService;
import com.project.humanresource.service.IUserService;
import com.project.humanresource.utility.UserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AdminController {

   private final IAdminService adminService;

    @PostMapping("/approve-user/{id}")
    public ResponseEntity<BaseResponse<Boolean>> approveUser(@PathVariable Long id) {
       adminService.approveUser(id);
       return ResponseEntity.ok(BaseResponse.<Boolean>builder()
                       .code(200)
                       .message("User approved and subscription started.")
                       .data(true)
               .build());
    }

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


    @PostMapping("/approve/{id}")
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
}
