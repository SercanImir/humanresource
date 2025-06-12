package com.project.humanresource.entity;


import com.project.humanresource.utility.UserStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "userrole")
public class UserRole   {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // <<< burayı ekleyin
    private Long id;
    @Enumerated(EnumType.STRING)
    @Column( nullable = false)
    UserStatus userStatus;
    Long userId;

} 