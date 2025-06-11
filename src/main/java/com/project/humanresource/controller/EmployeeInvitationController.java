//package com.project.humanresource.controller;
//
//import com.project.humanresource.dto.auth.EmployeeInviteRequestDto;
//import com.project.humanresource.dto.auth.ResetPasswordRequestDto;
//import com.project.humanresource.dto.response.BaseResponse;
//import com.project.humanresource.service.IEmployeeInvitationService;
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/invitations")
//@RequiredArgsConstructor
//public class EmployeeInvitationController {
//
//    private final IEmployeeInvitationService invitationService;
//
//    /**
//     * Manager’in davet endpoint’i.
//     */
//    @PostMapping("/invite")
//    public ResponseEntity<BaseResponse<Boolean>> inviteEmployee(
//            @Valid @RequestBody EmployeeInviteRequestDto dto
//    ) {
//        invitationService.inviteEmployee(dto);
//        return ResponseEntity.ok(BaseResponse.<Boolean>builder()
//                .code(200)
//                .message("Invitation sent successfully.")
//                .data(true)
//                .build());
//    }
//
//    /**
//     * Çalışanın şifre belirleme endpoint’i.
//     */
//    @PostMapping("/reset-password")
//    public ResponseEntity<BaseResponse<Boolean>> resetPassword(
//            @Valid @RequestBody ResetPasswordRequestDto dto
//    ) {
//        invitationService.resetPassword(dto);
//        return ResponseEntity.ok(BaseResponse.<Boolean>builder()
//                .code(200)
//                .message("Password set successfully.")
//                .data(true)
//                .build());
//    }
//}
