package com.project.humanresource.service;

import com.project.humanresource.entity.UserRole;
import com.project.humanresource.repostiory.UserRoleRepository;
import com.project.humanresource.utility.UserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserRoleServiceImpl implements IUserRoleService {


    private final UserRoleRepository userRoleRepository;


    @Override
    public List<UserStatus> findAllRoleStatuses(Long userId) {
        return userRoleRepository.findByUserId(userId)
                .stream()
                .map(r->r.getUserStatus())
                .collect(Collectors.toList());
    }

    @Override
    public void assignRole(Long userId, UserStatus userStatus ) {
        // Sonra yeni rolü ata
        UserRole newRole = new UserRole();
        newRole.setUserId(userId);
        newRole.setUserStatus(userStatus);
        userRoleRepository.save(newRole);
    }

    @Override
    public void removeRole(Long id, UserStatus userStatus) {
            userRoleRepository.deleteByUserIdAndUserStatus(id, userStatus);
    }
}
