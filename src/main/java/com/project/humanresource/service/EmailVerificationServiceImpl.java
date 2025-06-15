package com.project.humanresource.service;

import com.project.humanresource.entity.EmailVerification;
import com.project.humanresource.entity.User;
import com.project.humanresource.exception.ErrorType;
import com.project.humanresource.exception.HumanResourceException;
import com.project.humanresource.repostiory.EmailVerificationRepository;
import com.project.humanresource.repostiory.UserRepository;
import jakarta.transaction.Transactional;
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
    private final IUserService userService;
    private final JavaMailSender mailSender;



    @Override
    @Transactional
    public void verifyEmail(String token) {
        // 1) Token’ı al
        EmailVerification emailVerification = emailVerificationRepository.findByToken(token)
                .orElseThrow(() -> new HumanResourceException(ErrorType.INVALID_TOKEN));

        // 2) Süre dolmuş mu?
        if (emailVerification.getExpiryDate().isBefore(LocalDateTime.now())) {
            emailVerificationRepository.deleteByToken(token);
            throw new HumanResourceException(ErrorType.EXPIRED_TOKEN);
        }

        // 3) User’ı al
        User user = userService.findById(emailVerification.getUserId())
                .orElseThrow(() -> new HumanResourceException(ErrorType.USER_NOT_FOUND));

        // 4) EmailVerified flag’ini set et
        //    Burada dikkat et: User entity’sinde Boolean mı yoksa primitive boolean mı?
        //    Eğer primitive boolean ise Lombok getter’ı isEmailVerified() olur.
        //    Eğer Boolean obje ise getter getEmailVerified() olur.
        if (!user.isEmailVerified()) {
            user.setEmailVerified(true);
            userService.save(user);
        }

        // 5) Token’ı sil
        emailVerificationRepository.deleteByToken(token);
    }

    @Override
    @Transactional
    public void resendVerificationEmail(String email) {
        // 1) User’ı al
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new HumanResourceException(ErrorType.USER_NOT_FOUND));

        // 2) Zaten doğrulandı mı?
        if (Boolean.TRUE.equals(user.isEmailVerified())) {
            throw new HumanResourceException(ErrorType.ALREADY_VERIFIED);
        }

        // 3) Eski token’ları sil
        emailVerificationRepository.deleteByUserId(user.getId());

        // 4) Yeni token üret ve kaydet
        String newToken = UUID.randomUUID().toString();
        EmailVerification ev = EmailVerification.builder()
                .token(newToken)
                .expiryDate(LocalDateTime.now().plusHours(5))
                .userId(user.getId())
                .isUsed(false)
                .build();
        emailVerificationRepository.save(ev);

        // 5) Mail gönderimi
        String link = "http://localhost:9090/api/email-verification/confirm?token=" + newToken;
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(user.getEmail());
        mail.setSubject("Please verify your email");
        mail.setText("Click to verify: " + link);
        mailSender.send(mail);
    }

    /**
     * Kullanıcıya onay/red kararını bildiren e-posta yollar.
     *
     * @param to           Alıcının e-posta adresi
     * @param companyName  Başvurulan şirketin adı
     * @param approved     True ise onaylandı, false ise reddedildi
     */
    public void sendDecisionEmail(String to, String companyName, boolean approved) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject("Your Company Application " + (approved ? "Approved" : "Rejected"));
        msg.setText(buildBody(companyName, approved));
        mailSender.send(msg);
    }

    private String buildBody(String companyName, boolean approved) {
        if (approved) {
            return String.join(
                    "\n",
                    "Hello,",
                    "",
                    "Congratulations! Your application for \"" + companyName + "\" has been approved by our admin.",
                    "You can now log in and start using your account.",
                    "",
                    "Best regards,",
                    "PeopleMesh Team"
            );
        } else {
            return String.join(
                    "\n",
                    "Hello,",
                    "",
                    "We regret to inform you that your application for \"" + companyName + "\" has been rejected.",
                    "For more information, please contact our support team.",
                    "",
                    "Best regards,",
                    "PeopleMesh Team"
            );
        }
    }

}
