package com.project.humanresource.service;

import com.project.humanresource.entity.Employee;

public interface IEmployeeService {
    Employee findByUserId(Long userId);
}
