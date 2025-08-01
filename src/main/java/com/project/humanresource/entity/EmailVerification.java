package com.project.humanresource.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tblemailverification")
public class EmailVerification extends BaseEntity {


    @Column(nullable = false, unique = true)
    private String token;

    @Column(name="expiry_date", nullable = false)
    private LocalDateTime expiryDate;

    @Column(name="user_id", nullable = false)
    private Long userId;

    @Column(name="is_used", nullable = false)
    private Boolean isUsed = false;

}
