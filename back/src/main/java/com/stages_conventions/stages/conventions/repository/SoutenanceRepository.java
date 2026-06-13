package com.stages_conventions.stages.conventions.repository;

import com.stages_conventions.stages.conventions.model.Stage;
import com.stages_conventions.stages.conventions.model.Soutenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface SoutenanceRepository extends JpaRepository<Soutenance, Long> {

    Soutenance findByStage(Stage stage);

    List<Soutenance> findBySalle(String salle);

    List<Soutenance> findByDate(LocalDate date);

    List<Soutenance> findAllByOrderByDateAscHeureAsc();

    Soutenance findBySalleAndDateAndHeure(String salle, LocalDate date, LocalTime heure);

    Soutenance findByStage_Etudiant_Id(Long idEtudiant);

    @Query("SELECT s FROM Soutenance s JOIN s.membresJury j WHERE j.encadrant.id = :idEncadrant")
    List<Soutenance> findSoutenancesByJuryEncadrantId(@Param("idEncadrant") Long idEncadrant);

    List<Soutenance> findBySalleContainingIgnoreCase(String salle);
}