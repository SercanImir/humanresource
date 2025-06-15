package com.project.humanresource.service;

import com.project.humanresource.dto.request.CompanyUpdateRequestDto;
import com.project.humanresource.dto.response.CompanyListResponseDto;
import com.project.humanresource.dto.response.PendingCompanyResponseDto;
import com.project.humanresource.dto.response.StatisticsResponseDto;
import com.project.humanresource.entity.Company;
import com.project.humanresource.entity.Employee;
import com.project.humanresource.entity.User;
import com.project.humanresource.exception.ErrorType;
import com.project.humanresource.exception.HumanResourceException;
import com.project.humanresource.repostiory.CompanyRepository;
import com.project.humanresource.repostiory.EmployeeRepository;
import com.project.humanresource.repostiory.UserRepository;
import com.project.humanresource.repostiory.UserRoleRepository;
import com.project.humanresource.utility.UserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
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
    private final IEmailVerificationService emailVerificationService;
    private final UserRoleRepository userRoleRepository;


    /**
     * Admin onayıyla:
     * - Kullanıcı e-posta doğrulaması kontrolü,
     * - Çalışanın şirketini bulma,
     * - Aboneliği şimdi başlatıp enum’dan getMonths() ile hesaplama,
     * - Kullanıcıyı aktif etme ve Manager rolü atama.
     */
//

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
                company.getCompanyPhoneNumber(),
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
        company.setActive(true);
        companyRepository.save(company);

        Employee employee=employeeRepository.findFirstByCompanyId(companyId)
                .orElseThrow(() -> new HumanResourceException(ErrorType.USER_NOT_FOUND));

        User user= userRepository.findById(employee.getUserId())
                .orElseThrow(() -> new HumanResourceException(ErrorType.USER_NOT_FOUND));

        user.setEnabled(true);
        userService.save(user);
        userRoleService.removeRole(user.getId(),UserStatus.PENDING);
        userRoleService.assignRole(user.getId(), UserStatus.MANAGER);

        emailVerificationService.sendDecisionEmail(user.getEmail(),company.getCompanyName(),true);
    }

    @Override
    public void rejectCompany(Long companyId){
        Company company=companyRepository.findById(companyId)
                .orElseThrow(() -> new HumanResourceException(ErrorType.COMPANY_NOT_FOUND));
        Employee employee=employeeRepository.findFirstByCompanyId(companyId)
                .orElseThrow(() -> new HumanResourceException(ErrorType.USER_NOT_FOUND));
        User user=userRepository.findById(employee.getUserId())
                .orElseThrow(() -> new HumanResourceException(ErrorType.USER_NOT_FOUND));

        // Sil veya pasifleştirme tercihe göre
        companyRepository.delete(company);
        userRepository.delete(user);
        emailVerificationService.sendDecisionEmail(user.getEmail(),company.getCompanyName(),false);
    }

    @Override
    public List<CompanyListResponseDto> getApprovedCompanies() {
        return companyRepository.findAllByIsActiveTrue()
                .stream()
                .map(this::toListDto)
                .collect(Collectors.toList());
    }



    private CompanyListResponseDto toListDto(Company company) {
        //başvuran employee+user bilgilerini alalım
        Employee employee=employeeRepository.findFirstByCompanyId(company.getId())
                .orElseThrow(()-> new HumanResourceException(ErrorType.USER_NOT_FOUND));

        User user=userRepository.findById(employee.getUserId())
                .orElseThrow(()-> new HumanResourceException(ErrorType.USER_NOT_FOUND));

        return new CompanyListResponseDto(
                company.getId(),
                company.getCompanyName(),
                company.getCompanyPhoneNumber(),
                employee.getFirstName(),
                employee.getFirstName(),
                user.getEmail(),
                company.getCompanyAddress(),
                company.getSubscriptionType(),
                company.getSubscriptionStart(),
                company.getSubscriptionEnd(),
                company.getCreatedAt(),
                company.isActive()



        );
    }

    @Override
    public void toggleCompanyActive(Long companyId){
        Company company=companyRepository.findById(companyId)
                .orElseThrow(() -> new HumanResourceException(ErrorType.COMPANY_NOT_FOUND));

        boolean now=!company.isActive();
        company.setActive(now);
        companyRepository.save(company);

        if (!now){
            // Pasif yapıldıysa kullnıcıyı kapatıp rolü kaldır
            Employee employee=employeeRepository.findFirstByCompanyId(companyId)
                    .orElseThrow(() -> new HumanResourceException(ErrorType.USER_NOT_FOUND));

            User user= userRepository.findById(employee.getUserId())
                    .orElseThrow(() -> new HumanResourceException(ErrorType.USER_NOT_FOUND));

            user.setEnabled(false);
            userService.save(user);
            userRoleService.assignRole(user.getId(), UserStatus.MANAGER);
        }

    }


    @Override
    public StatisticsResponseDto getStatistics(){
        long totalCompanies=companyRepository.countByIsVerifiedTrue();
        long totalManagers = userRoleRepository.countDistinctUserIdByStatus(UserStatus.MANAGER);
        long totalEmployees=employeeRepository.count();
        return new  StatisticsResponseDto(totalCompanies,totalManagers,totalEmployees);
    }



}
