package com.stages_conventions.stages.conventions.serviceImpl;

import com.stages_conventions.stages.conventions.dto.ObjectifDTO;
import com.stages_conventions.stages.conventions.enums.PrioriteEnum;
import com.stages_conventions.stages.conventions.enums.StatutObjectifEnum;
import com.stages_conventions.stages.conventions.exception.ElementDejaExistant;
import com.stages_conventions.stages.conventions.exception.ElementNonTrouver;
import com.stages_conventions.stages.conventions.exception.ElementNull;
import com.stages_conventions.stages.conventions.mapper.ObjectifMapper;
import com.stages_conventions.stages.conventions.model.Objectif;
import com.stages_conventions.stages.conventions.repository.ObjectifRepository;
import com.stages_conventions.stages.conventions.service.ObjectifService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class ObjectifServiceImpl implements ObjectifService {

    private final ObjectifRepository objectifRepository;
    private final ObjectifMapper objectifMapper;

    @Override
    public List<ObjectifDTO.Output> listerObjectifs() {
        return objectifRepository.findAll()
                .stream()
                .map(objectifMapper::toOutput)
                .toList();
    }

    @Override
    public ObjectifDTO.Output recupererObjectif(Long id) {
        if (id == null) {
            throw new ElementNull("L'ID de l'objectif ne peut pas être null");
        }
        return objectifRepository.findById(id)
                .map(objectifMapper::toOutput)
                .orElseThrow(() ->
                        new ElementNonTrouver("Objectif non trouvé avec l'ID : " + id));
    }

    @Override
    public List<ObjectifDTO.Output> listerObjectifsParStage(Long stageId) {
        if (stageId == null) {
            throw new ElementNull("L'ID du stage ne peut pas être null");
        }
        return objectifRepository.findByStageId(stageId)
                .stream()
                .map(objectifMapper::toOutput)
                .toList();
    }

    @Override
    public ObjectifDTO.Output ajouterObjectif(ObjectifDTO.CreateInput dto) {
        if (dto == null) {
            throw new ElementNull("L'objectif à ajouter est null");
        }
        if (objectifRepository.existsByStageIdAndDescription(
                dto.getIdStage(),
                dto.getDescription())) {
            throw new ElementDejaExistant(
                    "Un objectif avec cette description existe déjà pour ce stage");
        }

        Objectif objectif = objectifMapper.toEntity(dto);

        if (objectif.getStatut() == null) {
            objectif.setStatut(StatutObjectifEnum.NON_COMMENCE);
        }
        if (objectif.getPriorite() == null) {
            objectif.setPriorite(PrioriteEnum.MOYENNE);
        }

        Objectif saved = objectifRepository.save(objectif);
        return objectifMapper.toOutput(saved);
    }

    @Override
    public ObjectifDTO.Output modifierObjectif(Long id, ObjectifDTO.UpdateInput dto) {
        if (id == null) {
            throw new ElementNull("L'ID est null");
        }
        if (dto == null) {
            throw new ElementNull("Les données sont null");
        }

        Objectif objectif = objectifRepository.findById(id)
                .orElseThrow(() ->
                        new ElementNonTrouver(
                                "Objectif introuvable avec l'ID : " + id));

        objectifMapper.updateEntity(dto, objectif);
        Objectif updated = objectifRepository.save(objectif);
        return objectifMapper.toOutput(updated);
    }

    @Override
    public ObjectifDTO.Output changerStatut(Long id, StatutObjectifEnum statut) {
        Objectif objectif = objectifRepository.findById(id)
                .orElseThrow(() -> new ElementNonTrouver("Objectif introuvable"));

        if (objectif.getStatut() == StatutObjectifEnum.VALIDE) {
            throw new IllegalStateException("Impossible de modifier un objectif déjà validé");
        }

        objectif.setStatut(statut);
        return objectifMapper.toOutput(objectifRepository.save(objectif));
    }

    @Override
    public void supprimerObjectif(Long id) {
        if (id == null) {
            throw new ElementNull("L'ID est null");
        }
        Objectif objectif = objectifRepository.findById(id)
                .orElseThrow(() ->
                        new ElementNonTrouver(
                                "Objectif introuvable avec l'ID : " + id));
        objectifRepository.delete(objectif);
    }
}