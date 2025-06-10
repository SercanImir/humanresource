package com.project.humanresource.service;

import com.project.humanresource.entity.UserRole;
import com.project.humanresource.repostiory.UserRoleRepository;
import com.project.humanresource.utility.UserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class UserRoleServiceImpl implements IUserRoleService {


    private final UserRoleRepository userRoleRepository;


    @Override
    public List<UserRole> findAllRole(Long userId) {
        return userRoleRepository.findByUserId(userId);
    }

    @Override
    public void assignRole(Long userId, UserStatus userStatus ) {
        // Sonra yeni rolü ata
        UserRole newRole = new UserRole();
        newRole.setUserId(userId);
        newRole.setUserStatus(userStatus);
        userRoleRepository.save(newRole);
    }
}
