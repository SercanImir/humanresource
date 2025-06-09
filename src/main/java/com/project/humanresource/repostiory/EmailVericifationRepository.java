package com.project.humanresource.repostiory;

import com.project.humanresource.entity.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


public interface EmailVericifationRepository extends JpaRepository<EmailVerification, Long> {

    Optional<EmailVerification> findByToken(String token);
}
