package com.project.humanresource.repostiory;

import com.project.humanresource.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

}
