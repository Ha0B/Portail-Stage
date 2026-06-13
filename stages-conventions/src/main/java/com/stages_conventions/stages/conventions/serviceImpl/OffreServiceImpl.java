package com.stages_conventions.stages.conventions.serviceImpl;

import com.stages_conventions.stages.conventions.dto.OffreDTO;
import com.stages_conventions.stages.conventions.model.Entreprise;
import com.stages_conventions.stages.conventions.model.Offre;
import com.stages_conventions.stages.conventions.exception.ElementNull;
import com.stages_conventions.stages.conventions.exception.ElementNonTrouver;
import com.stages_conventions.stages.conventions.mapper.OffreMapper;
import com.stages_conventions.stages.conventions.repository.EntrepriseRepository;
import com.stages_conventions.stages.conventions.repository.OffreRepository;
import com.stages_conventions.stages.conventions.service.OffreService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class OffreServiceImpl implements OffreService {

    private final OffreRepository offreRepository;
    private final EntrepriseRepository entrepriseRepository;
    private final OffreMapper offreMapper;

    // Méthode utilitaire privée, non exposée dans l'interface
    private Offre recupererOffreEntity(Long id) {
        if (id == null || id <= 0) {
            throw new ElementNull("ID de l'offre invalide");
        }
        return offreRepository.findById(id)
                .orElseThrow(() -> new ElementNonTrouver("Offre avec l'ID " + id + " n'existe pas"));
    }

    @Override
    public OffreDTO.Output ajouterOffre(OffreDTO.CreateInput input) {
        if (input == null) {
            throw new ElementNull("Les données de l'offre ne peuvent pas être nulles");
        }

        Entreprise entreprise = entrepriseRepository.findById(input.getEntrepriseId());
        if (entreprise == null) {
            throw new ElementNonTrouver("Entreprise introuvable");
        }

        Offre offre = offreMapper.toEntity(input, entreprise);

        // Optionnel : Vous pouvez définir un statut par défaut ici si nécessaire
        // offre.setStatut(StatutOffreEnum.OUVERTE);

        Offre savedOffre = offreRepository.save(offre);
        return offreMapper.toOutput(savedOffre);
    }

    @Override
    public List<OffreDTO.Output> listerOffres() {
        return offreRepository.findAll().stream()
                .map(offreMapper::toOutput)
                .collect(Collectors.toList());
    }

    @Override
    public OffreDTO.Output trouverOffre(Long id) {
        return offreMapper.toOutput(recupererOffreEntity(id));
    }

    @Override
    public List<OffreDTO.Output> listerOffreParEntreprise(Long idEntreprise) {
        if (idEntreprise == null || idEntreprise <= 0) {
            throw new ElementNull("ID entreprise invalide");
        }
        return offreRepository.findByEntrepriseId(idEntreprise).stream()
                .map(offreMapper::toOutput)
                .collect(Collectors.toList());
    }

    @Override
    public List<OffreDTO.Output> searchOffres(String titre, String lieu, String competences) {
        return offreRepository.searchOffres(titre, lieu, competences).stream()
                .map(offreMapper::toOutput)
                .collect(Collectors.toList());
    }

    @Override
    public OffreDTO.Output modifierOffre(Long id, OffreDTO.UpdateInput input) {
        if (input == null) {
            throw new ElementNull("Les données de mise à jour ne peuvent pas être nulles");
        }

        Offre oldOffre = recupererOffreEntity(id);

        // MapStruct applique uniquement les champs non nulls du DTO vers l'entité
        offreMapper.updateEntity(input, oldOffre);

        return offreMapper.toOutput(offreRepository.save(oldOffre));
    }

    @Override
    public boolean supprimerOffre(Long id) {
        Offre offre = recupererOffreEntity(id);
        offreRepository.delete(offre);
        return true;
    }
}