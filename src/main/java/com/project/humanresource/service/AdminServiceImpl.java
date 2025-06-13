package com.project.humanresource.service;

import com.project.humanresource.dto.request.PendingCompanyResponseDto;
import com.project.humanresource.dto.response.CompanyResponseDto;
import com.project.humanresource.entity.Company;
import com.project.humanresource.entity.Employee;
import com.project.humanresource.entity.User;
import com.project.humanresource.exception.ErrorType;
import com.project.humanresource.exception.HumanResourceException;
import com.project.humanresource.repostiory.CompanyRepository;
import com.project.humanresource.repostiory.EmployeeRepository;
import com.project.humanresource.repostiory.UserRepository;
import com.project.humanresource.utility.SubscriptionType;
import com.project.humanresource.utility.UserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements IAdminService {

    private final IUserService userService;
    private final IEmployeeService employeeService;
    private final CompanyRepository companyRepository;
    private final IUserRoleService userRoleService;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;


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

    @Override
    public List<PendingCompanyResponseDto> getPendingCompanies() {
        return companyRepository.findAllByIsVerifiedFalse()
                .stream()
                .map(this::toPendingDto)
                .collect(Collectors.toList());
    }

    private PendingCompanyResponseDto toPendingDto(Company company) {
        // ① Bu şirketin “başvurusunu yapan” ilk employee’yi bul
        Employee employee = employeeRepository
                .findFirstByCompanyId(company.getId())
                .orElseThrow(() ->
                        new HumanResourceException(ErrorType.USER_NOT_FOUND));

        // ② O employee’nin User kaydını al
        User user = userRepository
                .findById(employee.getUserId())
                .orElseThrow(() ->
                        new HumanResourceException(ErrorType.USER_NOT_FOUND));

        return new PendingCompanyResponseDto(
                company.getId(),
                company.getCompanyName(),
                employee.getFirstName(),
                employee.getLastName(),
                user.getEmail(),
                company.getSubscriptionType(),
                company.getCreatedAt()

        );

    }

    @Override
    public void approveCompany(Long companyId) {
        Company company=companyRepository.findById(companyId)
                .orElseThrow(() -> new HumanResourceException(ErrorType.COMPANY_NOT_FOUND));

        // abonelik tarihini başlat ve bitir
        LocalDateTime now = LocalDateTime.now();
        company.setSubscriptionStart(now);
        company.setSubscriptionEnd(now.plusMonths(company.getSubscriptionType().getMonths()));

        company.setVerified(true);
        companyRepository.save(company);
    }

}
