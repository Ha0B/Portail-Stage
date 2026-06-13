package com.stages_conventions.stages.conventions.serviceImpl;

import com.stages_conventions.stages.conventions.dto.EntrepriseDTO;
import com.stages_conventions.stages.conventions.model.Entreprise;
import com.stages_conventions.stages.conventions.enums.RoleEnum;
import com.stages_conventions.stages.conventions.exception.ElementDejaExistant;
import com.stages_conventions.stages.conventions.exception.ElementNonTrouver;
import com.stages_conventions.stages.conventions.exception.ElementNull;
import com.stages_conventions.stages.conventions.mapper.EntrepriseMapper;
import com.stages_conventions.stages.conventions.repository.EntrepriseRepository;
import com.stages_conventions.stages.conventions.service.EntrepriseService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class EntrepriseServiceImpl implements EntrepriseService {

    private EntrepriseRepository entrepriseRep;
    private EntrepriseMapper entrepriseMapper;

    @Override
    public EntrepriseDTO.Output ajouterEntreprise(EntrepriseDTO.CreateInput dto) {
        if (dto == null) {
            throw new ElementNull("Entreprise null");
        }

        if (entrepriseRep.findByNomEntreprise(dto.getNomEntreprise()) != null) {
            throw new ElementDejaExistant("Nom entreprise déjà utilisé");
        }

        if (entrepriseRep.findByEmail(dto.getEmail()) != null) {
            throw new ElementDejaExistant("Email déjà utilisé");
        }

        Entreprise entreprise = entrepriseMapper.toEntity(dto);

        entreprise.setRole(RoleEnum.ENTREPRISE);
        entreprise.setActif(true);
        entreprise.setDateCreation(LocalDate.now());

        return entrepriseMapper.toOutput(entrepriseRep.save(entreprise));
    }

    @Override
    public EntrepriseDTO.Output chercherEntrepriseId(Long idEntreprise) {
        if (idEntreprise == null) {
            throw new ElementNull("ID null");
        }

        Entreprise entreprise = entrepriseRep.findById(idEntreprise);

        if (entreprise == null) {
            throw new ElementNonTrouver("Entreprise introuvable");
        }

        return entrepriseMapper.toOutput(entreprise);
    }

    @Override
    public List<EntrepriseDTO.Output> listerEntreprise() {
        return entrepriseRep.findAll()
                .stream()
                .map(entrepriseMapper::toOutput)
                .toList();
    }

    @Override
    public boolean supprimerEntreprise(Long idEntreprise) {
        if (idEntreprise == null) {
            throw new ElementNull("ID null");
        }

        Entreprise entreprise = entrepriseRep.findById(idEntreprise);

        if (entreprise == null) {
            return false;
        }

        entrepriseRep.delete(entreprise);
        return true;
    }

    @Override
    public EntrepriseDTO.Output modifierEntreprise(Long idEntreprise, EntrepriseDTO.UpdateInput dto) {
        if (dto == null) {
            throw new ElementNull("DTO null");
        }

        Entreprise entreprise = entrepriseRep.findById(idEntreprise);

        if (entreprise == null) {
            throw new ElementNonTrouver("Entreprise introuvable");
        }

        if (!entreprise.getEmail().equals(dto.getEmail())) {
            if (entrepriseRep.findByEmail(dto.getEmail()) != null) {
                throw new ElementDejaExistant("Email déjà utilisé");
            }
        }

        if (!entreprise.getNomEntreprise().equals(dto.getNomEntreprise())) {
            if (entrepriseRep.findByNomEntreprise(dto.getNomEntreprise()) != null) {
                throw new ElementDejaExistant("Nom entreprise déjà utilisé");
            }
        }

        entrepriseMapper.updateEntity(dto, entreprise);

        return entrepriseMapper.toOutput(entrepriseRep.save(entreprise));
    }
}