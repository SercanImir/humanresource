package com.project.humanresource.service;

import com.project.humanresource.entity.UserRole;
import com.project.humanresource.repostiory.UserRoleRepository;
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
}
