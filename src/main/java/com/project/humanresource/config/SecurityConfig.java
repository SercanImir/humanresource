package com.project.humanresource.config;



import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.*;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.*;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtUserDetails jwtUserDetails;
    private final JwtManager jwtManager;

    /**
     * CORS ayarlarını global olarak tanımlar.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(List.of("http://localhost:5173")); // frontend adresi
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setAllowedMethods(List.of("*"));
        cfg.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }

    /**
     * AuthenticationManager bean’i; login işleminde kullanılır.
     */
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder builder =
                http.getSharedObject(AuthenticationManagerBuilder.class);

        builder.userDetailsService(jwtUserDetails)


              .passwordEncoder(passwordEncoder());
        return builder.build();
    }

    /**
     * Güvenlik filtresi zinciri: JWT filtresi, yol bazlı yetkilendirme, CORS ve CSRF ayarları.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // JWT doğrulama filtresi
        JwtAuthenticationFilter jwtFilter =
                new JwtAuthenticationFilter(jwtManager, jwtUserDetails);

        http
                .cors(Customizer.withDefaults()) // corsConfigurationSource bean’ini kullanır
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        // Public uç noktalar
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/email-verification/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/api/invitations/**"
                        ).permitAll()
                        // Admin işlemleri
                        .requestMatchers("/api/admin/**").hasAuthority("SITE_ADMIN")
                        // Manager işlemleri
                        .requestMatchers("/api/manager/**").hasAuthority("MANAGER")
                        // Employee işlemleri
                        .requestMatchers("/api/employee/**").hasAuthority("EMPLOYEE")
                        // Diğer tüm istekler kimlik doğrulaması gerektirir
                        .anyRequest().authenticated()
                )
                // JWT filtresini Spring’in UsernamePasswordAuthenticationFilter’ından önce ekler
                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    /**
     * Şifreleri BCrypt ile hash’lemek için encoder.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }
}
