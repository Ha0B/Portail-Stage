package com.stages_conventions.stages.conventions.service;

import com.stages_conventions.stages.conventions.dto.RapportDTO;
import com.stages_conventions.stages.conventions.enums.StatutRapportEnum;
import com.stages_conventions.stages.conventions.model.Rapport;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface RapportService {

    Rapport recupererRapportEntity(Long id) ;

    List<RapportDTO.Output> listerRapports();

    RapportDTO.Output recupererRapport(Long id);

    RapportDTO.Output ajouterRapport(MultipartFile file, RapportDTO.CreateInput dto) throws IOException;

    List<RapportDTO.Output> listerRapportsParStage(Long stageId);

    RapportDTO.Output modifierRapport(Long id, RapportDTO.UpdateInput dto);

    RapportDTO.Output changerStatut(Long id, StatutRapportEnum statut);

    void supprimerRapport(Long id);

    List<RapportDTO.Output> getRapportsParEncadrant(Long idEncadrant);
}