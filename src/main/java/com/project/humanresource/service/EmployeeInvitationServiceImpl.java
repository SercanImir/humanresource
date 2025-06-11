//package com.project.humanresource.service;
//
//import com.project.humanresource.dto.request.EmployeeInviteRequestDto;
//import com.project.humanresource.entity.Employee;
//import com.project.humanresource.exception.ErrorType;
//import com.project.humanresource.exception.HumanResourceException;
//import com.project.humanresource.repostiory.EmployeeRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//public void inviteEmployee(EmployeeInviteRequestDto dto) {
//
//
//    // --- 1) Manager'ın kim olduğunu oku ---
//    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//    String managerEmail = auth.getName();
//    Employee manager = employeeRepository.findByEmail(managerEmail)
//            .orElseThrow(() -> new HumanResourceException(ErrorType.USER_NOT_FOUND));
//
//    // --- 2) Varolan veya yeni Employee kaydet ---
//    Employee employee = employeeRepository.findByEmail(dto.email())
//            .orElseGet(() -> {
//                Employee e = Employee.builder()
//                        .email(dto.email())
//                        .firstName(null)           // davet formunda yoksa
//                        .lastName(null)
//                        .password(null)
//                        .emailVerified(true)       // davetle onaylı
//                        .enabled(false)            // şifre belirlenene kadar pasif
//                        // manager’ın şirketi ve dalı
//                        .companyId(manager.getCompanyId())
//                        .branchId(dto.branchId())  // davet sırasında seçilen şube
//                        .titleName(dto.titleName())// davet sırasında girilen ünvan
//                        .build();
//                return employeeRepository.save(e);
//            });
//
//    // --- 3) Eski token’ları temizle ---
//    tokenRepository.deleteByUserId(employee.getId());
//
//    // --- 4) Yeni reset-token oluştur ve sakla ---
//    String token = UUID.randomUUID().toString();
//    PasswordResetToken prt = PasswordResetToken.builder()
//            .userId(employee.getId())
//            .token(token)
//            .expiryDate(LocalDateTime.now().plusHours(24))
//            .build();
//    tokenRepository.save(prt);
//
//    // --- 5) Davet mailini gönder ---
//    String link = appBaseUrl + "/api/invitations/reset-password?token=" + token;
//    SimpleMailMessage mail = new SimpleMailMessage();
//    mail.setTo(dto.email());
//    mail.setSubject("You are invited! Set your password");
//    mail.setText(
//            "Hello,\n" +
//                    "You have been invited by " + manager.getFirstName() + " " + manager.getLastName() + " to join as "
//                    + dto.titleName() + " at our branch.\n" +
//                    "Please set your password using the link below (expires in 24h):\n" + link
//    );
//    mailSender.send(mail);
//}
//
//@Override
//@Transactional
//public void resetPassword(ResetPasswordRequestDto dto) {
//    if (!dto.newPassword().equals(dto.confirmPassword())) {
//        throw new HumanResourceException(ErrorType.PASSWORD_MISMATCH);
//    }
//    PasswordResetToken prt = tokenRepository.findByToken(dto.token())
//            .orElseThrow(() -> new HumanResourceException(ErrorType.INVALID_TOKEN));
//    if (prt.getExpiryDate().isBefore(LocalDateTime.now())) {
//        tokenRepository.delete(prt);
//        throw new HumanResourceException(ErrorType.EXPIRED_TOKEN);
//    }
//
//    Employee employee = employeeRepository.findById(prt.getUserId())
//            .orElseThrow(() -> new HumanResourceException(ErrorType.USER_NOT_FOUND));
//    employee.setPassword(passwordEncoder.encode(dto.newPassword()));
//    employee.setEnabled(true);
//    employeeRepository.save(employee);
//
//    // Çalışan rolünü ata
//    userRoleService.assignRole(employee.getId(), UserStatus.EMPLOYEE);
//
//    tokenRepository.delete(prt);
//}
//}