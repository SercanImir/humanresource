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


    @Override
    public void approveUser(Long userId) {

        //  1   Kullanıcı
        Optional<User> user=userService.findById(userId);

        if(!user.get().isEmailVerified()){
            throw new HumanResourceException(ErrorType.EMAIL_NOT_VERIFIED);
        }
        Employee employee=employeeService.findByUserId(userId);
        Company company=companyRepository.findById(employee.getCompanyId())
                .orElseThrow(() -> new HumanResourceException(ErrorType.COMPANY_NOT_FOUND));


        // 3) Abonelik tarihleri (enum veya parse)
        LocalDateTime now = LocalDateTime.now();
        int months = SubscriptionType.valueOf(company.getSubscriptionType().toUpperCase()).getMonths();
        company.setSubscriptionStart(now);
        company.setSubscriptionEnd(now.plusMonths(months));
        company.setVerified(true);
        companyRepository.save(company);

        // 4) Kullanıcı onayı ve rol ata
        user.get().setEnabled(true);
        userService.save(user.get());
        userRoleService.assignRole(userId, UserStatus.MANAGER);
    }
}
