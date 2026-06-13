package com.stages_conventions.stages.conventions.service;

import com.stages_conventions.stages.conventions.dto.EtudiantDTO;
import com.stages_conventions.stages.conventions.dto.StageDTO;
import java.util.List;

public interface StageService {

    StageDTO.Output ajouterStage(StageDTO.CreateInput input);

    StageDTO.Output recupererStage(Long id);

    List<StageDTO.Output> listerStages();

    List<StageDTO.Output> recupererStagesEtudiant(Long etudiantId);

    List<StageDTO.StagiaireDTO> recupererStagesEntreprise(Long entrepriseId);

    List<EtudiantDTO.Output> recupererEtudiantsEncadres(Long idEncadrant);

    boolean supprimerStage(Long id);

    StageDTO.Output modifierStatutStage(Long id, String statut);

    boolean verifierDatesStage(Long id);

    StageDTO.Output modifierStage(Long id, StageDTO.UpdateInput input);
}