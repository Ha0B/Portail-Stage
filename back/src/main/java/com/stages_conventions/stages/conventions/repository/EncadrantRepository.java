package com.stages_conventions.stages.conventions.repository;

import com.stages_conventions.stages.conventions.model.Encadrant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EncadrantRepository extends JpaRepository<Encadrant,Long> {
    Encadrant findByEmail(String email);

}
