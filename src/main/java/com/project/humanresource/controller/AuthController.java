package com.project.humanresource.controller;

import com.project.humanresource.dto.request.LoginRequestDto;
import com.project.humanresource.dto.request.RegisterRequestDto;
import com.project.humanresource.dto.response.BaseResponse;
import com.project.humanresource.dto.response.JwtResponseDto;
import com.project.humanresource.exception.ErrorType;
import com.project.humanresource.exception.HumanResourceException;
import com.project.humanresource.service.AuthServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RequestMapping("/api/auth")
@RestController
@CrossOrigin("*")
public class AuthController {

    private final AuthServiceImpl authServiceImpl;


    @PostMapping("/register")
    public ResponseEntity<BaseResponse<Boolean>> register (@RequestBody RegisterRequestDto dto){
        if (!dto.password().equals(dto.rePassword())) {
            throw new HumanResourceException(ErrorType.PASSWORD_MISMATCH);
        }
        authServiceImpl.register(dto);
        return ResponseEntity.ok(BaseResponse.<Boolean>builder()
                        .code(200)
                        .message("Registration successful; please check your email.")
                        .data(true)
                .build());

    }

    @GetMapping("/verify")
    public ResponseEntity<BaseResponse<Boolean>> verifyEmail (@RequestParam("token") String token){
        authServiceImpl.verifyEmail(token);
        return ResponseEntity.ok(BaseResponse.<Boolean>builder()
                        .code(200)
                        .message("Email verified; waiting for admin approval.")
                        .data(true)
                .build());
    }


    @PostMapping("/login")
    public ResponseEntity<BaseResponse<JwtResponseDto>> login(@Valid @RequestBody LoginRequestDto dto){
        JwtResponseDto jwt= authServiceImpl.login(dto);
        return ResponseEntity.ok(BaseResponse.<JwtResponseDto>builder()
                        .code(200)
                        .message("Login successful.")
                        .data(jwt)
                .build());
    }

}
