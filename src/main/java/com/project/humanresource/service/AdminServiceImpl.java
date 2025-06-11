package com.project.humanresource.service;

import com.project.humanresource.entity.Company;
import com.project.humanresource.entity.Employee;
import com.project.humanresource.entity.User;
import com.project.humanresource.exception.ErrorType;
import com.project.humanresource.exception.HumanResourceException;
import com.project.humanresource.repostiory.CompanyRepository;
import com.project.humanresource.utility.SubscriptionType;
import com.project.humanresource.utility.UserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements IAdminService {

    private final IUserService userService;
    private final IEmployeeService employeeService;
    private final CompanyRepository companyRepository;
    private final IUserRoleService userRoleService;


    /**
     * Admin onayıyla:
     * - Kullanıcı e-posta doğrulaması kontrolü,
     * - Çalışanın şirketini bulma,
     * - Aboneliği şimdi başlatıp enum’dan getMonths() ile hesaplama,
     * - Kullanıcıyı aktif etme ve Manager rolü atama.
     */
    @Override
    public void approveUser(Long userId) {
        // 1) Kullanıcıyı al
        User user = userService.findById(userId)
                .orElseThrow(() -> new HumanResourceException(ErrorType.USER_NOT_FOUND));

        // 2) E-posta doğrulanmış mı?
        if (!user.isEmailVerified()) {
            throw new HumanResourceException(ErrorType.EMAIL_NOT_VERIFIED);
        }

        // 3) Employee’dan companyId al, Company’yi getir
        Employee emp = employeeService.findByUserId(userId);
        Company company = companyRepository.findById(emp.getCompanyId())
                .orElseThrow(() -> new HumanResourceException(ErrorType.COMPANY_NOT_FOUND));

        // 4) Aboneliği başlatma: enum’dan ay sayısını al
        LocalDateTime now = LocalDateTime.now();
        company.setSubscriptionStart(now);
        SubscriptionType subType = company.getSubscriptionType();  // enum kullanıyoruz
        company.setSubscriptionEnd(now.plusMonths(subType.getMonths()));
        company.setVerified(true);
        companyRepository.save(company);

        // 5) Kullanıcıyı aktif et ve Manager rolünü ata
        user.setEnabled(true);
        userService.save(user);
        userRoleService.assignRole(userId, UserStatus.MANAGER);
    }
}
