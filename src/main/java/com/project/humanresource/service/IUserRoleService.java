package com.project.humanresource.service;

import com.project.humanresource.entity.UserRole;

import java.util.List;

public interface IUserRoleService {

    List<UserRole> findAllRole(Long userId);
}
