package com.stages_conventions.stages.conventions.service;

import com.stages_conventions.stages.conventions.dto.SoutenanceDTO;
import java.time.LocalDate;
import java.util.List;

public interface SoutenanceService {

    List<SoutenanceDTO.Output> listeSoutenance();

    SoutenanceDTO.Output trouverSoutenance(Long id);

    SoutenanceDTO.Output recupererSoutenanceParEtudiant(Long idEtudiant);

    List<SoutenanceDTO.Output> recupererSoutenancesParJuryEncadrant(Long idEncadrant);

    SoutenanceDTO.Output creerSoutenance(SoutenanceDTO.CreateInput input);

    SoutenanceDTO.Output modifierSoutenance(Long id, SoutenanceDTO.UpdateInput input);

    boolean supprimerSoutenance(Long id);

    List<SoutenanceDTO.Output> trouverParSalle(String salle);

    List<SoutenanceDTO.Output> trouverParDate(LocalDate date);

    List<SoutenanceDTO.Output> planning();
}