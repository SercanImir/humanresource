package com.project.humanresource.repostiory;

import com.project.humanresource.entity.UserRole;
import com.project.humanresource.utility.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    List<UserRole> findByUserId(Long userId);

    long countByUserStatus(UserStatus userStatus);

    void deleteByUserIdAndUserStatus(Long userId, UserStatus userStatus);

    // İstatistik için distinct sayım:
    @Query("select count(distinct ur.userId) from UserRole ur where ur.userStatus = :status")
    long countDistinctUserIdByStatus(@Param("status") UserStatus status);


    boolean existsByUserIdAndUserStatus(Long userId, UserStatus userStatus);
}
