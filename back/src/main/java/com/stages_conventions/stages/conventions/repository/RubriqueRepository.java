package com.stages_conventions.stages.conventions.repository;

import com.stages_conventions.stages.conventions.model.Rubrique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RubriqueRepository extends JpaRepository<Rubrique, Long> {

}