package com.project.humanresource.repostiory;

import com.project.humanresource.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    /**
     * Kayıt sırasında her şirket için oluşturulan ilk Employee
     * aynı zamanda başvuru sahibidir.
     */
    Optional<Employee> findFirstByCompanyId(Long companyId);
}
