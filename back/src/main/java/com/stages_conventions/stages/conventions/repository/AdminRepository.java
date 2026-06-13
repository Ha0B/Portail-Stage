package com.stages_conventions.stages.conventions.repository;

import com.stages_conventions.stages.conventions.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

    Admin findByEmail(String emailAdmin);
}
