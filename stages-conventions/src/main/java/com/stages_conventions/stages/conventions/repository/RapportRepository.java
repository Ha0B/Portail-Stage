package com.stages_conventions.stages.conventions.repository;

import com.stages_conventions.stages.conventions.model.Rapport;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface RapportRepository extends JpaRepository<Rapport, Long> {

    boolean existsByStageId(@NotNull(message = "L'ID du stage est obligatoire") Long idStage);

    List<Rapport> findByStageId(Long stageId);

    List<Rapport> findByStageEncadrantId(Long idEncadrant);
}
