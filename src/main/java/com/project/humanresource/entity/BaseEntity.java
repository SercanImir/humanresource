package com.project.humanresource.entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@MappedSuperclass
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor

public abstract class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    boolean isActive=true;
    LocalDateTime createdAt=LocalDateTime.now();
    LocalDateTime updatedAt;


} 