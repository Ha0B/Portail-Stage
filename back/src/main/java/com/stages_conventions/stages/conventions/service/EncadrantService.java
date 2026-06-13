package com.stages_conventions.stages.conventions.service;

import com.stages_conventions.stages.conventions.dto.EncadrantDTO;
import java.util.List;

public interface EncadrantService {

    EncadrantDTO.Output chercherEncadrantId(Long id);

    EncadrantDTO.Output chercherEncadrantEmail(String email);

    List<EncadrantDTO.Output> listerEncadrants();

    EncadrantDTO.Output ajouterEncadrant(EncadrantDTO.CreateInput dto);

    EncadrantDTO.Output supprimerEncadrant(Long id);

    EncadrantDTO.Output modifierEncadrant(Long id, EncadrantDTO.UpdateInput dto);
}