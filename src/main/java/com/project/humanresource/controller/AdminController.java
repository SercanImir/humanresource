package com.project.humanresource.controller;

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
}
