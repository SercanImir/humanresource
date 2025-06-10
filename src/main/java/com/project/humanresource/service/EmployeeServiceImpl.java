package com.project.humanresource.service;

import com.project.humanresource.entity.Employee;
import com.project.humanresource.exception.ErrorType;
import com.project.humanresource.exception.HumanResourceException;
import com.project.humanresource.repostiory.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements IEmployeeService {

    private final EmployeeRepository employeeRepository;

    @Override
    public Employee findByUserId(Long userId) {
        return employeeRepository.findById(userId)
                .orElseThrow(()->new HumanResourceException(ErrorType.USER_NOT_FOUND));
    }
}
