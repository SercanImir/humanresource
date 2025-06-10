package com.project.humanresource.service;

import com.project.humanresource.entity.UserRole;
import com.project.humanresource.utility.UserStatus;

import java.util.List;

public interface IUserRoleService {

    List<UserRole> findAllRole(Long userId);

    void assignRole(Long id, UserStatus userStatus);
}
