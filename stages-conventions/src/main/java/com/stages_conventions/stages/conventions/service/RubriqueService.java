package com.stages_conventions.stages.conventions.service;

import com.stages_conventions.stages.conventions.dto.RubriqueDTO;
import java.util.List;

public interface RubriqueService {

    List<RubriqueDTO.Output> listerRubriques();

    RubriqueDTO.Output recupererRubrique(Long id);

    RubriqueDTO.Output ajouterRubrique(RubriqueDTO.CreateInput dto);

    RubriqueDTO.Output modifierRubrique(Long id, RubriqueDTO.UpdateInput dto);

    void supprimerRubrique(Long id);
}