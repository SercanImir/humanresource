package com.project.humanresource.service;

import com.project.humanresource.entity.EmailVerification;
import com.project.humanresource.entity.User;
import com.project.humanresource.exception.ErrorType;
import com.project.humanresource.exception.HumanResourceException;
import com.project.humanresource.repostiory.EmailVerificationRepository;
import com.project.humanresource.repostiory.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmailVerificationServiceImpl implements IEmailVerificationService {
    private final EmailVerificationRepository emailVerificationRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;

    @Override
    public void verifyEmail(String token) {
        //  1. Tokenı bul
        EmailVerification emailVerification = emailVerificationRepository.findByToken(token)
                .orElseThrow(()-> new HumanResourceException(ErrorType.INVALID_TOKEN));

        //  2.  Süre kontrolü
        if (emailVerification.getExpiryDate().isBefore(LocalDateTime.now())){
            emailVerificationRepository.deleteById(emailVerification.getId());
            throw new HumanResourceException(ErrorType.EXPIRED_TOKEN);
        }

        //  3.  İlgili kullanıcıyı al
        User user=userRepository.findById(emailVerification.getUserId())
                .orElseThrow(()-> new HumanResourceException(ErrorType.USER_NOT_FOUND));


        // 4. E-posta doğrulamasını işaretle
        user.setEmailVerified(true);
        userRepository.save(user);

        // 5. Token kaydını temizle
        emailVerificationRepository.delete(emailVerification);


    }

    @Override
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new HumanResourceException(ErrorType.USER_NOT_FOUND));
        if(Boolean.TRUE.equals(user.isEmailVerified())){
            throw new HumanResourceException(ErrorType.ALREADY_VERIFIED);
        }

        emailVerificationRepository.deleteByUserId(user.getId());

        String newToken=UUID.randomUUID().toString();
        EmailVerification emailVerification = EmailVerification.builder()
                .userId(user.getId())
                .token(newToken)
                .expiryDate(LocalDateTime.now().plusHours(5))
                .build();
        emailVerificationRepository.save(emailVerification);

        String link = "http://localhost:9090/api/email-verification/confirm?token=" + newToken;
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(user.getEmail());
        mail.setSubject("Please verify your email (resend)");
        mail.setText("To verify your account, click here: " + link);
        mailSender.send(mail);


    }
}
