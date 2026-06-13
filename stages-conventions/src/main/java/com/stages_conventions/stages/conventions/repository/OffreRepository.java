package com.stages_conventions.stages.conventions.repository;

import com.stages_conventions.stages.conventions.model.Offre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OffreRepository extends JpaRepository<Offre, Long> {

    List<Offre> findByEntrepriseId(Long idEntreprise);

    // Recherche  (Titre, Lieu, Compétences)
    @Query("SELECT o FROM Offre o WHERE " +
            "(:titre IS NULL OR LOWER(o.titre) LIKE LOWER(CONCAT('%', :titre, '%'))) AND " +
            "(:lieu IS NULL OR LOWER(o.lieu) LIKE LOWER(CONCAT('%', :lieu, '%'))) AND " +
            "(:competences IS NULL OR LOWER(o.competencesRequises) LIKE LOWER(CONCAT('%', :competences, '%')))")
    List<Offre> searchOffres(
            @Param("titre") String titre,
            @Param("lieu") String lieu,
            @Param("competences") String competences
    );
}