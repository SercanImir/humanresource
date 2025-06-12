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
import org.apache.catalina.Role;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements IAuthService {

    private final AuthenticationManager authenticationManager;
    private final IUserService userService;
    private final JwtManager jwtManager;
    private final IUserRoleService userRoleService;
    private final EmailVerificationRepository emailVerificationRepository;
    private final JavaMailSenderImpl mailSender;
    private final CompanyRepository companyRepository;
    private final EmployeeRepository employeeRepository;


    @Override
    public void register(RegisterRequestDto dto) {

        //  1   Email Kontrolü
        if (userService.findByEmail(dto.email()).isPresent()) {
            throw new HumanResourceException(ErrorType.EMAIL_ALREADY_EXISTS);
        }
        // 2) Company getir veya oluştur
        Company company=companyRepository.findByCompanyName(dto.companyName())
                .orElseGet(()->Company.builder()
                        .companyName(dto.companyName())
                        .companyPhoneNumber(dto.phoneNumber())
                        .companyEmail(dto.email())
                        .subscriptionType(dto.subscriptionType())
                        .subscriptionStart(LocalDateTime.now())
                        .isVerified(false)
                        .build());
        company=companyRepository.save(company);

        User user=User.builder()
                .email(dto.email())
                .password(dto.password())
                .emailVerified(false)
                .enabled(false)
                .build();

        // 3) Employee (User kısmını da miras alır) yarat

        Employee employee=Employee.builder()
                .firstName(dto.firstName())
                .lastName(dto.lastName())
                .companyId(company.getId())
                .build();
        employee=employeeRepository.save(employee);


        //  4   Başlangıçta Pendin rolü ata
        userRoleService.assignRole(user.getId(),UserStatus.PENDING);

        //  5   E-posta doğrulama token üret kaydet
        String token= UUID.randomUUID().toString();
        EmailVerification emailVerification = EmailVerification.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .token(token)
                .expiryDate(LocalDateTime.now().plusHours(5))
                .isUsed(false)
                .build();
        emailVerificationRepository.save(emailVerification);

        //
        //  6    Mail Gönder
        String link = "http://localhost:9090/api/email-verification/confirm?token=" + token;
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(dto.email());
        mail.setSubject("Please verify your email");
        mail.setText("Click to verify: " + link);
        mailSender.send(mail);


    }

    /**
     * E-posta üzerindeki linke tıklandığında çağrılır:
     * 1) Token geçerli mi kontrol et
     * 2) Kullanıcının emailVerified alanını true yap
     * 3) Token’ı sil
     */

    @Override
    public void verifyEmail(String token) {
        EmailVerification emailVerification=emailVerificationRepository.findByToken(token)
                .orElseThrow(()->new HumanResourceException(ErrorType.INVALID_TOKEN));

        if (emailVerification.getExpiryDate().isBefore(LocalDateTime.now())) {
            emailVerificationRepository.deleteById(emailVerification.getId());
            throw new HumanResourceException(ErrorType.EXPIRED_TOKEN);
        }
        User user=userService.findById(emailVerification.getUserId())
                .orElseThrow(()->new HumanResourceException(ErrorType.USER_NOT_FOUND));

        user.setEmailVerified(true);
        userService.save(user);

        emailVerificationRepository.delete(emailVerification);

    }
    /**
     * Login akışı:
     * 1) AuthenticationManager ile email/password kontrolü
     * 2) EmailVerified ve Enabled bayraklarını kontrol et
     * 3) JWT oluştur (userId + email + roller)
     * 4) JwtResponseDto döndür
     */
    @Override
    public JwtResponseDto login(LoginRequestDto dto) {

        //  1.  Kimlik  Doğrulama

        try{
            Authentication auth=authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.email(), dto.password())
            );
        }catch(AuthenticationException ex){
            throw new HumanResourceException(ErrorType.INVALID_CREDENTIALS);
        }

        //  2   Kullanıcıyı DB'den al ve durum kontrolleri
        User user=userService.findByEmail(dto.email())
                .orElseThrow(()->new HumanResourceException(ErrorType.USER_NOT_FOUND));

        if (!user.isEmailVerified()){
            throw new HumanResourceException(ErrorType.EMAIL_NOT_VERIFIED);
        }
        if(!user.isEnabled()){
            throw new HumanResourceException(ErrorType.USER_NOT_ENABLED);
        }

        List<String> roles = userRoleService.findAllRole(user.getId())
                .stream()
                .map(UserRole::getUserStatus)
                .map(Enum::name)
                .collect(Collectors.toList());


        //  3   JWT üretimi
        String token=jwtManager.generateToken(user.getId(), user.getEmail(), roles);


        return new JwtResponseDto(token,"Bearer",user.getEmail(),roles);
    }
}
