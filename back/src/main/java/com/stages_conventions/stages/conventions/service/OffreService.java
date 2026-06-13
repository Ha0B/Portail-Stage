package com.stages_conventions.stages.conventions.service;

import com.stages_conventions.stages.conventions.dto.OffreDTO;
import java.util.List;

public interface OffreService {

    OffreDTO.Output ajouterOffre(OffreDTO.CreateInput input);

    List<OffreDTO.Output> listerOffres();

    OffreDTO.Output trouverOffre(Long id);

    List<OffreDTO.Output> listerOffreParEntreprise(Long idEntreprise);

    List<OffreDTO.Output> searchOffres(String titre, String lieu, String competences);

    OffreDTO.Output modifierOffre(Long id, OffreDTO.UpdateInput input);

    boolean supprimerOffre(Long id);
}