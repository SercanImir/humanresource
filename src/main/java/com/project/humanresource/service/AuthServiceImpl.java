package com.project.humanresource.service;

import com.project.humanresource.config.JwtManager;
import com.project.humanresource.dto.request.LoginRequestDto;
import com.project.humanresource.dto.request.RegisterRequestDto;
import com.project.humanresource.dto.response.JwtResponseDto;
import com.project.humanresource.entity.*;
import com.project.humanresource.exception.ErrorType;
import com.project.humanresource.exception.HumanResourceException;
import com.project.humanresource.repostiory.CompanyRepository;
import com.project.humanresource.repostiory.EmailVerificationRepository;
import com.project.humanresource.repostiory.EmployeeRepository;
import com.project.humanresource.utility.UserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements IAuthService {
    private final AuthenticationManager       authenticationManager;
    private final IUserService                userService;
    private final JwtManager                  jwtManager;
    private final IUserRoleService            userRoleService;
    private final EmailVerificationRepository emailVerificationRepository;
    private final JavaMailSender              mailSender;
    private final CompanyRepository           companyRepository;
    private final EmployeeRepository          employeeRepository;

    @Override
    @Transactional
    public void register(RegisterRequestDto dto) {
        // 1) Email kontrolü
        if (userService.findByEmail(dto.email()).isPresent()) {
            throw new HumanResourceException(ErrorType.EMAIL_ALREADY_EXISTS);
        }

        // 2) Company getir veya oluştur
        Company company = companyRepository
                .findByCompanyName(dto.companyName())
                .orElseGet(() -> Company.builder()
                        .companyName(dto.companyName())
                        .companyPhoneNumber(dto.phoneNumber())
                        .companyEmail(dto.email())         // eğer entity’de companyEmail zorunluysa
                        .subscriptionType(dto.subscriptionType())
                        .createdAt(LocalDateTime.now())
                        .isVerified(false)
                        .build()
                );
        company = companyRepository.save(company);

        // 3) User oluştur ve kaydet
        User user = User.builder()
                .email(dto.email())
                .password(dto.password())
                .emailVerified(false)
                .enabled(false)
                .createdAt(LocalDateTime.now())
                .build();
        user = userService.save(user);            // <-- mutlaka kaydetmeli

        // 4) Employee yarat (userId’i de set et)
        Employee employee = Employee.builder()
                .userId(user.getId())
                .companyId(company.getId())
                .firstName(dto.firstName())
                .lastName(dto.lastName())
                .createdAt(LocalDateTime.now())
                .build();
        employeeRepository.save(employee);

        // 5) “Pending” rol ata
        userRoleService.assignRole(user.getId(), UserStatus.PENDING);

        // 6) Email doğrulama token’ı üret & kaydet
        String token = UUID.randomUUID().toString();
        EmailVerification emailVerification = EmailVerification.builder()
                .token(token)
                .expiryDate(LocalDateTime.now().plusHours(5))
                .userId(user.getId())
                .isUsed(false)
                .build();
        emailVerificationRepository.save(emailVerification);

        // 7) Doğrulama maili gönder
        String link = "http://localhost:9090/api/email-verification/confirm?token=" + token;
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(dto.email());
        mail.setSubject("Please verify your email");
        mail.setText("Click here to verify your account: " + link);
        mailSender.send(mail);
    }



    @Override
    public JwtResponseDto login(LoginRequestDto dto) {
        // 1) Kimlik doğrulama
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.email(), dto.password())
            );
        } catch (AuthenticationException ex) {
            throw new HumanResourceException(ErrorType.INVALID_CREDENTIALS);
        }

        // 2) Kullanıcıyı al + bayrak kontrolü
        User user = userService.findByEmail(dto.email())
                .orElseThrow(() -> new HumanResourceException(ErrorType.USER_NOT_FOUND));
        if (!user.isEmailVerified()) throw new HumanResourceException(ErrorType.EMAIL_NOT_VERIFIED);
        if (!user.isEnabled())       throw new HumanResourceException(ErrorType.USER_NOT_ENABLED);

        // 3) Roller
        List<UserStatus> roleEnums = userRoleService
                .findAllRoleStatuses(user.getId());

        List<String> roles = roleEnums.stream()
                .map(Enum::name)
                .toList();

        // 4) JWT üretimi
        String token = jwtManager.generateToken(user.getId(), user.getEmail(), roles);

        return new JwtResponseDto(token,  user.getEmail(), roleEnums);
    }
}
