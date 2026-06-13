package com.stages_conventions.stages.conventions.serviceImpl;

import com.stages_conventions.stages.conventions.dto.EncadrantDTO;
import com.stages_conventions.stages.conventions.model.Encadrant;
import com.stages_conventions.stages.conventions.exception.ElementDejaExistant;
import com.stages_conventions.stages.conventions.exception.ElementNonTrouver;
import com.stages_conventions.stages.conventions.exception.ElementNull;
import com.stages_conventions.stages.conventions.mapper.EncadrantMapper;
import com.stages_conventions.stages.conventions.repository.EncadrantRepository;
import com.stages_conventions.stages.conventions.service.EncadrantService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class EncadrantServiceImpl implements EncadrantService {

    private final EncadrantRepository encadrantRepository;
    private final EncadrantMapper encadrantMapper;

    @Override
    public EncadrantDTO.Output chercherEncadrantId(Long id) {
        if (id == null) throw new ElementNull("ID ne peut pas être null");

        return encadrantRepository.findById(id)
                .map(encadrantMapper::toOutput)
                .orElseThrow(() -> new ElementNonTrouver("Encadrant n'existe pas"));
    }

    @Override
    public EncadrantDTO.Output chercherEncadrantEmail(String email) {
        if (email == null || email.isEmpty())
            throw new ElementNull("Email ne peut pas être null");

        Encadrant encadrant = encadrantRepository.findByEmail(email);
        if (encadrant == null) throw new ElementNonTrouver("Encadrant n'existe pas");

        return encadrantMapper.toOutput(encadrant);
    }

    @Override
    public List<EncadrantDTO.Output> listerEncadrants() {
        return encadrantRepository.findAll()
                .stream()
                .map(encadrantMapper::toOutput)
                .toList();
    }

    @Override
    public EncadrantDTO.Output ajouterEncadrant(EncadrantDTO.CreateInput dto) {
        if (dto == null) throw new ElementNull("Encadrant ne peut pas être null");

        if (encadrantRepository.findByEmail(dto.getEmail()) != null)
            throw new ElementDejaExistant("Email déjà utilisé");

        Encadrant saved = encadrantRepository.save(encadrantMapper.toEntity(dto));
        return encadrantMapper.toOutput(saved);
    }

    @Override
    public EncadrantDTO.Output supprimerEncadrant(Long id) {
        if (id == null) throw new ElementNull("ID ne peut pas être null");

        Encadrant encadrant = encadrantRepository.findById(id)
                .orElseThrow(() -> new ElementNonTrouver("Encadrant n'existe pas"));

        encadrantRepository.delete(encadrant);
        return encadrantMapper.toOutput(encadrant);
    }

    @Override
    public EncadrantDTO.Output modifierEncadrant(Long id, EncadrantDTO.UpdateInput dto) {
        if (id == null) throw new ElementNull("ID ne peut pas être null");
        if (dto == null) throw new ElementNull("Encadrant ne peut pas être null");

        Encadrant existing = encadrantRepository.findById(id)
                .orElseThrow(() -> new ElementNonTrouver("Encadrant n'existe pas"));

        if (!dto.getEmail().equals(existing.getEmail())) {
            Encadrant emailOwner = encadrantRepository.findByEmail(dto.getEmail());
            if (emailOwner != null && !emailOwner.getId().equals(id))
                throw new ElementDejaExistant("Email déjà utilisé : " + dto.getEmail());
        }

        encadrantMapper.updateEntity(dto, existing);
        return encadrantMapper.toOutput(encadrantRepository.save(existing));
    }
}