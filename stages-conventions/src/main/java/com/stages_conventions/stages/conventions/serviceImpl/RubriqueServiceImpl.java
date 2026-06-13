package com.stages_conventions.stages.conventions.serviceImpl;

import com.stages_conventions.stages.conventions.dto.RubriqueDTO;
import com.stages_conventions.stages.conventions.model.Rubrique;
import com.stages_conventions.stages.conventions.exception.ElementNonTrouver;
import com.stages_conventions.stages.conventions.exception.ElementNull;
import com.stages_conventions.stages.conventions.mapper.RubriqueMapper;
import com.stages_conventions.stages.conventions.repository.RubriqueRepository;
import com.stages_conventions.stages.conventions.service.RubriqueService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class RubriqueServiceImpl implements RubriqueService {

    private final RubriqueRepository rubriqueRepository;
    private final RubriqueMapper rubriqueMapper;

    @Override
    public List<RubriqueDTO.Output> listerRubriques() {
        return rubriqueRepository.findAll()
                .stream()
                .map(rubriqueMapper::toOutput)
                .toList();
    }

    @Override
    public RubriqueDTO.Output recupererRubrique(Long id) {
        return rubriqueRepository.findById(id)
                .map(rubriqueMapper::toOutput)
                .orElseThrow(() -> new ElementNonTrouver("Rubrique non trouvée avec l'ID : " + id));
    }

    @Override
    public RubriqueDTO.Output ajouterRubrique(RubriqueDTO.CreateInput dto) {
        System.out.println("DTO recu : " + dto);
        Rubrique rubrique = rubriqueMapper.toEntity(dto);

        if (rubrique.getNoteMax() <= 0) {
            throw new IllegalArgumentException("La note maximale doit être supérieure à 0");
        }
        if (rubrique.getCoefficient() <= 0) {
            throw new IllegalArgumentException("Le coefficient doit être supérieur à 0");
        }

        Rubrique saved = rubriqueRepository.save(rubrique);
        return rubriqueMapper.toOutput(saved);
    }

    @Override
    public RubriqueDTO.Output modifierRubrique(Long id, RubriqueDTO.UpdateInput dto) {

        Rubrique existant = rubriqueRepository.findById(id)
                .orElseThrow(() -> new ElementNonTrouver("Rubrique n'existe pas avec l'ID : " + id));

        rubriqueMapper.updateEntity(dto, existant);
        Rubrique updated = rubriqueRepository.save(existant);
        return rubriqueMapper.toOutput(updated);
    }

    @Override
    public void supprimerRubrique(Long id) {
        if (id == null) throw new ElementNull("L'ID de la rubrique ne peut pas être null");

        Rubrique existant = rubriqueRepository.findById(id)
                .orElseThrow(() -> new ElementNonTrouver("Rubrique n'existe pas avec l'ID : " + id));

        if (existant.getNotes() != null && !existant.getNotes().isEmpty()) {
            throw new IllegalStateException("Impossible de supprimer une rubrique qui a des notes associées");
        }

        rubriqueRepository.delete(existant);
    }
}