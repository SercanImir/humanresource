package com.project.humanresource.config;

import org.springframework.web.filter.OncePerRequestFilter;

public class JwtTokenFilter extends OncePerRequestFilter {

    private final JwtManager jwtManager;

}
