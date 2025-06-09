package com.project.humanresource.service;

import com.project.humanresource.entity.EmailVerification;
import com.project.humanresource.entity.User;
import com.project.humanresource.exception.ErrorType;
import com.project.humanresource.exception.HumanResourceException;
import com.project.humanresource.repostiory.EmailVericifationRepository;
import com.project.humanresource.repostiory.UserRepository;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EmailVerificationServiceImpl implements IEmailVerifacationService{
    EmailVericifationRepository emailVerificationRepository;
    UserRepository userRepository;
    JavaMailSender mailSender;

    @Override
    public void verifyEmail(String token) {
        //  1. Tokenı bul
        EmailVerification emailVerification = emailVerificationRepository.findByToken(token)
                .orElseThrow(()-> new HumanResourceException(ErrorType.INVALID_TOKEN));

        //  2.  Süre kontrolü
        if (emailVerification.getExpiryDate().isBefore(LocalDateTime.now())){
            emailVerificationRepository.delete(emailVerification);
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

    }
}
