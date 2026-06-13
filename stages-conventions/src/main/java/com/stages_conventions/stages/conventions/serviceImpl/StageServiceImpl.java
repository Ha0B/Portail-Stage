package com.stages_conventions.stages.conventions.serviceImpl;

import com.stages_conventions.stages.conventions.dto.ConventionDTO;
import com.stages_conventions.stages.conventions.dto.EtudiantDTO;
import com.stages_conventions.stages.conventions.dto.StageDTO;
import com.stages_conventions.stages.conventions.enums.StatutStageEnum;
import com.stages_conventions.stages.conventions.exception.ElementNull;
import com.stages_conventions.stages.conventions.exception.ElementNonTrouver;
import com.stages_conventions.stages.conventions.mapper.ConventionMapper;
import com.stages_conventions.stages.conventions.mapper.EtudiantMapper;
import com.stages_conventions.stages.conventions.mapper.StageMapper;
import com.stages_conventions.stages.conventions.model.*;
import com.stages_conventions.stages.conventions.repository.*;
import com.stages_conventions.stages.conventions.service.StageService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class StageServiceImpl implements StageService {

    private final StageRepository stageRepository;
    private final EtudiantRepository etudiantRepository;
    private final EntrepriseRepository entrepriseRepository;
    private final EncadrantRepository encadrantRepository;
    private final ConventionRepository conventionRepository;
    private final ConventionMapper conventionMapper;
    private final StageMapper stageMapper;
    private final EtudiantMapper etudiantMapper;

    // Méthode utilitaire privée
    private Stage getStage(Long id) {
        if (id == null || id <= 0)
            throw new ElementNull("ID invalide");
        return stageRepository.findById(id)
                .orElseThrow(() -> new ElementNonTrouver("Stage introuvable"));
    }

    @Override
    public StageDTO.Output ajouterStage(StageDTO.CreateInput input) {
        Etudiant etudiant = etudiantRepository.findById(input.getEtudiantId())
                .orElseThrow(() -> new ElementNonTrouver("Étudiant introuvable"));

        Entreprise entreprise = null;
        if (input.getEntrepriseId() != null) {
            entreprise = entrepriseRepository.findById(input.getEntrepriseId());
        }

        Encadrant encadrant = null;
        if (input.getEncadrantId() != null) {
            encadrant = encadrantRepository.findById(input.getEncadrantId())
                    .orElseThrow(() -> new ElementNonTrouver("Encadrant introuvable"));
        }

        Stage stage = stageMapper.toEntity(input);
        stage.setEtudiant(etudiant);
        stage.setEntreprise(entreprise);
        stage.setEncadrant(encadrant);
        stage.setStatut(StatutStageEnum.EN_COURS);

        return stageMapper.toOutput(stageRepository.save(stage));
    }

    @Override
    public StageDTO.Output recupererStage(Long id) {
        return stageMapper.toOutput(getStage(id));
    }

    @Override
    public List<StageDTO.Output> listerStages() {
        return stageRepository.findAll()
                .stream()
                .map(stageMapper::toOutput)
                .collect(Collectors.toList());
    }

    @Override
    public List<StageDTO.Output> recupererStagesEtudiant(Long etudiantId) {
        if (etudiantId == null)
            throw new ElementNull("ID étudiant invalide");
        return stageRepository.findByEtudiantId(etudiantId)
                .stream()
                .map(stageMapper::toOutput)
                .collect(Collectors.toList());
    }

    @Override
    public List<StageDTO.StagiaireDTO> recupererStagesEntreprise(Long entrepriseId) {
        if (entrepriseId == null)
            throw new ElementNull("ID entreprise invalide");
        return stageRepository.findByEntrepriseId(entrepriseId)
                .stream()
                .map(stageMapper::toStagiaireDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EtudiantDTO.Output> recupererEtudiantsEncadres(Long idEncadrant) {
        if (idEncadrant == null) {
            throw new ElementNull("ID encadrant invalide");
        }
        List<Stage> stages = stageRepository.findByEncadrantId(idEncadrant);
        if (stages == null) throw new ElementNull("Stages introuvable");
        return stages.stream()
                .map(Stage::getEtudiant)
                .distinct()
                .map(etudiantMapper::toOutput)
                .toList();
    }

    @Override
    public boolean supprimerStage(Long id) {
        if (id == null)
            throw new ElementNull("ID invalide");
        Stage stage = getStage(id);
        if (stage == null)
            throw new ElementNonTrouver("Stage introuvable");
        stageRepository.delete(stage);
        return true;
    }

    @Override
    public StageDTO.Output modifierStatutStage(Long id, String statut) {
        Stage stage = getStage(id);
        if (stage == null) throw new ElementNonTrouver("Stage introuvable");

        if (statut.equals("TERMINE")) {
            ConventionDTO.CreateInput creer = new ConventionDTO.CreateInput();
            creer.setDateDebut(stage.getDateDebut());
            creer.setDateFin(stage.getDateFin());
            creer.setSujetStage(stage.getDescription());
            creer.setStageId(id);

            Convention convention = conventionMapper.toEntity(creer, stage);
            conventionRepository.save(convention);
        }

        stage.setStatut(StatutStageEnum.valueOf(statut.toUpperCase()));
        return stageMapper.toOutput(stageRepository.save(stage));
    }

    @Override
    public boolean verifierDatesStage(Long id) {
        Stage stage = getStage(id);
        return stage.getDateDebut() != null
                && stage.getDateFin() != null
                && !stage.getDateDebut().isAfter(stage.getDateFin());
    }

    @Override
    public StageDTO.Output modifierStage(Long id, StageDTO.UpdateInput input) {
        Stage stage = getStage(id);
        stageMapper.updateEntity(input, stage);

        if (input.getEntrepriseId() != null) {
            stage.setEntreprise(
                    entrepriseRepository.findById(input.getEntrepriseId())
            );
        }

        if (input.getEncadrantId() != null) {
            stage.setEncadrant(
                    encadrantRepository.findById(input.getEncadrantId())
                            .orElseThrow(() -> new ElementNonTrouver("Encadrant introuvable"))
            );
        }

        return stageMapper.toOutput(stageRepository.save(stage));
    }
}