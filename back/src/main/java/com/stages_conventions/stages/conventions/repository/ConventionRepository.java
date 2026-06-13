package com.stages_conventions.stages.conventions.repository;

import com.stages_conventions.stages.conventions.model.Convention;
import com.stages_conventions.stages.conventions.model.Stage;
import com.stages_conventions.stages.conventions.enums.StatutConventionEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConventionRepository extends JpaRepository<Convention, Long> {
    Convention findByStage(Stage stage);

    List<Convention> findByStageEtudiantId(Long etudiantId);

    List<Convention> findByStatut(StatutConventionEnum statut);

    List<Convention> findByStage_Entreprise_nomEntrepriseLike(String s);

    List<Convention> findByStatutAndStage_Entreprise_nomEntrepriseLike(StatutConventionEnum statut, String s);
}