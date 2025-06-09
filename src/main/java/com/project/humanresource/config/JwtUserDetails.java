package com.project.humanresource.config;

import com.project.humanresource.service.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtUserDetails implements UserDetailsService {

    private final UserService userService;
    private final UserRoleService userRoleService;
}
