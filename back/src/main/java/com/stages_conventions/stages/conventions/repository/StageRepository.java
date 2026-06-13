package com.stages_conventions.stages.conventions.repository;

import com.stages_conventions.stages.conventions.model.Etudiant;
import com.stages_conventions.stages.conventions.model.Stage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StageRepository extends JpaRepository<Stage, Long> {

        List<Stage> findByEtudiantId(Long etudiantId);

        List<Stage> findByEntrepriseId(Long entrepriseId);

        List<Stage> findByEncadrantId(Long encadrantId);

        Stage getByEtudiant(Etudiant etudiant);
}