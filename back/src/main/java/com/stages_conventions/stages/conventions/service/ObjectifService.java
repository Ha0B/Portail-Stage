package com.stages_conventions.stages.conventions.service;

import com.stages_conventions.stages.conventions.dto.ObjectifDTO;
import com.stages_conventions.stages.conventions.enums.StatutObjectifEnum;
import java.util.List;

public interface ObjectifService {

    List<ObjectifDTO.Output> listerObjectifs();

    ObjectifDTO.Output recupererObjectif(Long id);

    List<ObjectifDTO.Output> listerObjectifsParStage(Long stageId);

    ObjectifDTO.Output ajouterObjectif(ObjectifDTO.CreateInput dto);

    ObjectifDTO.Output modifierObjectif(Long id, ObjectifDTO.UpdateInput dto);

    ObjectifDTO.Output changerStatut(Long id, StatutObjectifEnum statut);

    void supprimerObjectif(Long id);
}