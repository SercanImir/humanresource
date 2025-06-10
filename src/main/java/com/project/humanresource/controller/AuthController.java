package com.project.humanresource.controller;

import com.project.humanresource.dto.request.LoginRequestDto;
import com.project.humanresource.dto.request.RegisterRequestDto;
import com.project.humanresource.dto.response.BaseResponse;
import com.project.humanresource.dto.response.JwtResponseDto;
import com.project.humanresource.exception.ErrorType;
import com.project.humanresource.exception.HumanResourceException;
import com.project.humanresource.service.AuthServiceImpl;
import com.project.humanresource.service.IAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RequestMapping("/api/auth")
@RestController
@CrossOrigin("*")
public class AuthController {

    private final IAuthService iAuthService;


    @PostMapping("/register")
    public ResponseEntity<BaseResponse<Boolean>> register (@RequestBody RegisterRequestDto dto){
        if (!dto.password().equals(dto.rePassword())) {
            throw new HumanResourceException(ErrorType.PASSWORD_MISMATCH);
        }
        iAuthService.register(dto);
        return ResponseEntity.ok(BaseResponse.<Boolean>builder()
                        .code(200)
                        .message("Registration successful; please check your email.")
                        .data(true)
                .build());

    }

    @GetMapping("/verify")
    public ResponseEntity<BaseResponse<Boolean>> verifyEmail (@RequestParam("token") String token){
        iAuthService.verifyEmail(token);
        return ResponseEntity.ok(BaseResponse.<Boolean>builder()
                        .code(200)
                        .message("Email verified; waiting for admin approval.")
                        .data(true)
                .build());
    }


    @PostMapping("/login")
    public ResponseEntity<BaseResponse<JwtResponseDto>> login(@Valid @RequestBody LoginRequestDto dto){
        JwtResponseDto jwt= iAuthService.login(dto);
        return ResponseEntity.ok(BaseResponse.<JwtResponseDto>builder()
                        .code(200)
                        .message("Login successful.")
                        .data(jwt)
                .build());
    }

}
