package com.project.humanresource.controller;

import com.project.humanresource.dto.response.BaseResponse;
import com.project.humanresource.service.IEmailVerificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email-verification")
public class EmailVerificationController {

    private final IEmailVerificationService verifacationService;

    public EmailVerificationController(IEmailVerificationService verifacationService) {
        this.verifacationService = verifacationService;
    }

    @GetMapping("/confirm")
    public ResponseEntity<BaseResponse<Boolean>> confirmToken(@RequestParam String token){
        verifacationService.verifyEmail(token);
        return ResponseEntity.ok(BaseResponse.<Boolean>builder()
                        .code(200)
                        .message("Email successfully verified; waiting for admin approval.")
                        .data(true)
                .build());
    }

    @PostMapping("/resend")
    public ResponseEntity<BaseResponse<Boolean>> resendVerification(@RequestParam("email")String email){
        verifacationService.resendVerificationEmail(email);
        return ResponseEntity.ok(BaseResponse.<Boolean>builder()
                        .code(200)
                        .message("Verification email resent.")
                        .data(true)
                .build());
    }

}
