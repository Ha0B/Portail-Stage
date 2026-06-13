package com.stages_conventions.stages.conventions.serviceImpl;

import com.stages_conventions.stages.conventions.dto.EtudiantDTO;
import com.stages_conventions.stages.conventions.model.Etudiant;
import com.stages_conventions.stages.conventions.enums.RoleEnum;
import com.stages_conventions.stages.conventions.exception.ElementDejaExistant;
import com.stages_conventions.stages.conventions.exception.ElementNonTrouver;
import com.stages_conventions.stages.conventions.exception.ElementNull;
import com.stages_conventions.stages.conventions.mapper.EtudiantMapper;
import com.stages_conventions.stages.conventions.repository.EtudiantRepository;
import com.stages_conventions.stages.conventions.service.EtudiantService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class EtudiantServiceImpl implements EtudiantService {

    private EtudiantRepository etudiantRep;
    private EtudiantMapper etudiantMapper;

    @Override
    public EtudiantDTO.Output ajouterEtudiant(EtudiantDTO.CreateInput dto) {
        if (dto == null) {
            throw new ElementNull("Impossible d'ajouter un étudiant null");
        }

        if (etudiantRep.findByNumeroEtudiant(dto.getNumeroEtudiant()) != null) {
            throw new ElementDejaExistant("Numéro étudiant déjà utilisé");
        }

        if (etudiantRep.findByEmail(dto.getEmail()) != null) {
            throw new ElementDejaExistant("Email déjà utilisé");
        }

        Etudiant etudiant = etudiantMapper.toEntity(dto);

        etudiant.setRole(RoleEnum.ETUDIANT);
        etudiant.setActif(true);
        etudiant.setDateCreation(LocalDate.now());

        return etudiantMapper.toOutput(etudiantRep.save(etudiant));
    }

    @Override
    public EtudiantDTO.Output chercherEtudId(Long idEtudiant) {
        Etudiant etudiant = etudiantRep.findById(idEtudiant)
                .orElseThrow(() -> new ElementNonTrouver("Etudiant n'existe pas"));

        return etudiantMapper.toOutput(etudiant);
    }

    @Override
    public List<EtudiantDTO.Output> listeEtudiant() {
        return etudiantRep.findAll()
                .stream()
                .map(etudiantMapper::toOutput)
                .toList();
    }

    @Override
    public boolean supprimerEtudiant(Long idEtudiant) {
        if (idEtudiant == null) {
            throw new ElementNull("ID null");
        }

        Etudiant etudiant = etudiantRep.findById(idEtudiant)
                .orElseThrow(() -> new ElementNonTrouver("Etudiant introuvable"));

        etudiantRep.delete(etudiant);
        return true;
    }

    @Override
    public EtudiantDTO.Output modifierEtudiant(Long id, EtudiantDTO.UpdateInput dto) {
        if (dto == null || id == null) {
            throw new ElementNull("ID ou DTO null");
        }

        Etudiant etudiant = etudiantRep.findById(id)
                .orElseThrow(() -> new ElementNonTrouver("Etudiant introuvable"));

        if (!etudiant.getNumeroEtudiant().equals(dto.getNumeroEtudiant())) {
            if (etudiantRep.findByNumeroEtudiant(dto.getNumeroEtudiant()) != null) {
                throw new ElementDejaExistant("Numéro étudiant déjà utilisé");
            }
        }

        if (!etudiant.getEmail().equals(dto.getEmail())) {
            if (etudiantRep.findByEmail(dto.getEmail()) != null) {
                throw new ElementDejaExistant("Email déjà utilisé");
            }
        }

        etudiantMapper.updateEntity(dto, etudiant);

        return etudiantMapper.toOutput(etudiantRep.save(etudiant));
    }
}