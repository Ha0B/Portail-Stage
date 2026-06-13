package com.stages_conventions.stages.conventions.service;

import com.stages_conventions.stages.conventions.dto.EntrepriseDTO;
import java.util.List;

public interface EntrepriseService {

    EntrepriseDTO.Output ajouterEntreprise(EntrepriseDTO.CreateInput dto);

    EntrepriseDTO.Output chercherEntrepriseId(Long idEntreprise);

    List<EntrepriseDTO.Output> listerEntreprise();

    boolean supprimerEntreprise(Long idEntreprise);

    EntrepriseDTO.Output modifierEntreprise(Long idEntreprise, EntrepriseDTO.UpdateInput dto);
}