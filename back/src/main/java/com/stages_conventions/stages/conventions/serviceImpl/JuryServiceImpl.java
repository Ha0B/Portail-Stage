package com.stages_conventions.stages.conventions.serviceImpl;

import com.stages_conventions.stages.conventions.dto.JuryDTO;
import com.stages_conventions.stages.conventions.model.*;
import com.stages_conventions.stages.conventions.exception.ElementDejaExistant;
import com.stages_conventions.stages.conventions.exception.ElementNonTrouver;
import com.stages_conventions.stages.conventions.exception.ElementNull;
import com.stages_conventions.stages.conventions.mapper.JuryMapper;
import com.stages_conventions.stages.conventions.repository.*;
import com.stages_conventions.stages.conventions.service.JuryService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class JuryServiceImpl implements JuryService {

    private JuryRepository juryRepository;
    private EncadrantRepository encadrantRepository;
    private SoutenanceRepository soutenanceRepository;
    private JuryMapper juryMapper;

    @Override
    @Transactional(readOnly = true)
    public List<JuryDTO.Output> listeJury() {
        return juryRepository.findAll()
                .stream()
                .map(juryMapper::toOutput)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public JuryDTO.Output trouverJury(String nomComplet) {
        if (nomComplet == null || nomComplet.trim().isEmpty()) {
            throw new ElementNull("Nom complet requis");
        }

        String[] nom = nomComplet.trim().split(" ");

        if (nom.length < 2) {
            throw new IllegalArgumentException("Format attendu: Prénom Nom");
        }

        Jury jury = juryRepository
                .findByEncadrant_NomLikeAndEncadrant_PrenomLike(nom[0], nom[1]);

        if (jury == null) {
            throw new ElementNonTrouver("Jury introuvable");
        }

        return juryMapper.toOutput(jury);
    }

    @Override
    public void affecterJury(JuryDTO.CreateInput dto) {
        if (dto == null) {
            throw new ElementNull("DTO null");
        }

        if (juryRepository.findByEncadrant_Id(dto.getEncadrantId()) != null) {
            throw new ElementDejaExistant("Encadrant déjà affecté");
        }

        Encadrant encadrant = encadrantRepository.findById(dto.getEncadrantId())
                .orElseThrow(() -> new ElementNonTrouver("Encadrant introuvable"));

        Soutenance soutenance = soutenanceRepository.findById(dto.getSoutenanceId())
                .orElseThrow(() -> new ElementNonTrouver("Soutenance introuvable"));

        Jury jury = juryMapper.toEntity(dto);
        jury.setEncadrant(encadrant);
        jury.setSoutenance(soutenance);

        juryRepository.save(jury);
    }

    @Override
    public void retirerJury(Long encadrantId) {
        if (encadrantId == null) {
            throw new ElementNull("Encadrant null");
        }

        Jury jury = juryRepository.findByEncadrant_Id(encadrantId);

        if (jury == null) {
            throw new ElementNonTrouver("Jury introuvable");
        }

        juryRepository.delete(jury);
    }

    @Override
    public void modifierJury(Long id, JuryDTO.UpdateInput dto) {
        Jury jury = juryRepository.findById(id)
                .orElseThrow(() -> new ElementNonTrouver("Jury introuvable"));

        if (dto.getEncadrantId() != null) {
            Encadrant encadrant = encadrantRepository.findById(dto.getEncadrantId())
                    .orElseThrow(() -> new ElementNonTrouver("Encadrant introuvable"));
            jury.setEncadrant(encadrant);
        }

        if (dto.getSoutenanceId() != null) {
            Soutenance soutenance = soutenanceRepository.findById(dto.getSoutenanceId())
                    .orElseThrow(() -> new ElementNonTrouver("Soutenance introuvable"));
            jury.setSoutenance(soutenance);
        }

        juryMapper.updateEntity(dto, jury);
        juryRepository.save(jury);
    }

    @Override
    public List<JuryDTO.Output> getJuryByEncadantId(Long id){
        return juryRepository
                .findJuryByEncadrantId(id)
                .stream()
                .map(juryMapper::toOutput)
                .toList() ;
    }

    @Override
    public List<JuryDTO.Output> getJuryBySoutenanceId(Long id) {
        return juryRepository
                .findBySoutenanceId(id)
                .stream()
                .map(juryMapper::toOutput)
                .toList();
    }

}