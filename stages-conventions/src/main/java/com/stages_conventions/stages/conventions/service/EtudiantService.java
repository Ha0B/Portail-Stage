package com.stages_conventions.stages.conventions.service;

import com.stages_conventions.stages.conventions.dto.EtudiantDTO;
import java.util.List;

public interface EtudiantService {

    EtudiantDTO.Output ajouterEtudiant(EtudiantDTO.CreateInput dto);

    EtudiantDTO.Output chercherEtudId(Long idEtudiant);

    List<EtudiantDTO.Output> listeEtudiant();

    boolean supprimerEtudiant(Long idEtudiant);

    EtudiantDTO.Output modifierEtudiant(Long id, EtudiantDTO.UpdateInput dto);
}