package com.project.humanresource.service;

import com.project.humanresource.entity.UserRole;
import com.project.humanresource.utility.UserStatus;

import java.util.List;

public interface IUserRoleService {
    void assignRole(Long id, UserStatus userStatus);
    List<UserStatus> findAllRoleStatuses(Long userId);



    void removeRole(Long id, UserStatus userStatus);
}
