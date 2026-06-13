package com.stages_conventions.stages.conventions.repository;

import com.stages_conventions.stages.conventions.enums.StatutCandidatureEnum;
import com.stages_conventions.stages.conventions.model.Candidature;
import com.stages_conventions.stages.conventions.model.Etudiant;
import com.stages_conventions.stages.conventions.model.Offre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidatureRepository extends JpaRepository<Candidature, Long> {

    Candidature findByEtudiantAndOffre(Etudiant etudiant, Offre offre);

    List<Candidature> findByEtudiantId(Long etudiantId);

    List<Candidature> findByOffreId(Long offreId);

    List<Candidature> findByOffreIdAndStatut(Long offreId, StatutCandidatureEnum statut);

    List<Candidature> findByOffreIdAndEtudiantPromotion(Long offreId, String promotion);

    List<Candidature> findByOffreIdAndEtudiantPromotionAndStatut(Long offreId, String promotion, StatutCandidatureEnum statut);
}