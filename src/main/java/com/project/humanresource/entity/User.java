package com.project.humanresource.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @NotBlank
    @Column(unique = true)
    @Size(min = 6)
     String email;
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
            message = "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one number"
    )
     String password;

    boolean enabled = false;             // admin onayıyla aktif edilecek
    boolean emailVerified = false;      // mail doğrulandı mı





}
