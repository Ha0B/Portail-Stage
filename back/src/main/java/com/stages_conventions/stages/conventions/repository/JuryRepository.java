package com.stages_conventions.stages.conventions.repository;

import com.stages_conventions.stages.conventions.dto.JuryDTO;
import com.stages_conventions.stages.conventions.model.Encadrant;
import com.stages_conventions.stages.conventions.model.Jury;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface JuryRepository extends JpaRepository<Jury, Long> {

    Jury findByEncadrant_NomLikeAndEncadrant_PrenomLike(String nom, String prenom);

    Jury findByEncadrant_Id(@NotNull(message = "Encadrant obligatoire") Long encadrantId);

    List<Jury> findBySoutenanceId(Long id);

    List<Jury> findJuryByEncadrantId(Long id);
}