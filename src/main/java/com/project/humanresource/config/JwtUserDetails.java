package com.project.humanresource.config;

import com.project.humanresource.entity.User;
import com.project.humanresource.entity.UserRole;
import com.project.humanresource.exception.ErrorType;
import com.project.humanresource.exception.HumanResourceException;
import com.project.humanresource.service.IUserRoleService;
import com.project.humanresource.service.IUserService;

import com.project.humanresource.utility.UserStatus;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JwtUserDetails implements UserDetailsService {

    private final IUserService userService;
    private final IUserRoleService userRoleService;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1) Email’e göre kullanıcıyı al
        User user=userService.findByEmail(email)
                .orElseThrow(()->new HumanResourceException(ErrorType.USER_NOT_FOUND));

        // 2) Rollerini DB’den çek
        List<GrantedAuthority> authorities=userRoleService.findAllRole(user.getId())
                .stream()
                .map(UserRole::getUserStatus)
                .map(Enum::name)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());


        // 3) Spring’in UserDetails objesine dönüştür
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(authorities)
                .accountLocked(false)
                .accountExpired(false)
                .credentialsExpired(false)
                // boolean tipler için isXxx() kullanın
                .disabled(!(user.isEmailVerified() && user.isEnabled()))
                .build();


    }
}
