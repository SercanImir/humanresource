package com.project.humanresource.service;

import com.project.humanresource.entity.User;



import java.util.Optional;

public interface IUserService {


   Optional<User> findByEmail(String email);


   Optional<User> findById(Long id);

   User save(User user);
}
