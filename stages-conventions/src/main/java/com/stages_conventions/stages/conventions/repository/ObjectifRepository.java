package com.stages_conventions.stages.conventions.repository;

import com.stages_conventions.stages.conventions.model.Objectif;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ObjectifRepository extends JpaRepository<Objectif, Long> {
    List<Objectif> findByStageId(Long stageId);

    boolean existsByStageIdAndDescription(@NotNull(message = "L'ID du stage est obligatoire") Long idStage, @NotBlank(message = "La description est obligatoire") String description);
}