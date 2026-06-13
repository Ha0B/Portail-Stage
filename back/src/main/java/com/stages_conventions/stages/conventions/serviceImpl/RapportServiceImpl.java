package com.stages_conventions.stages.conventions.serviceImpl;

import com.stages_conventions.stages.conventions.dto.RapportDTO;
import com.stages_conventions.stages.conventions.enums.StatutRapportEnum;
import com.stages_conventions.stages.conventions.exception.ElementDejaExistant;
import com.stages_conventions.stages.conventions.exception.ElementNonTrouver;
import com.stages_conventions.stages.conventions.exception.ElementNull;
import com.stages_conventions.stages.conventions.mapper.RapportMapper;
import com.stages_conventions.stages.conventions.model.Rapport;
import com.stages_conventions.stages.conventions.model.Stage;
import com.stages_conventions.stages.conventions.repository.RapportRepository;
import com.stages_conventions.stages.conventions.service.RapportService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class RapportServiceImpl implements RapportService {

    private final RapportRepository rapportRepository;
    private final RapportMapper rapportMapper;

    public Rapport recupererRapportEntity(Long id) {
        return rapportRepository.findById(id)
                .orElseThrow(() ->
                        new ElementNonTrouver("Rapport introuvable"));
    }

    @Override
    public List<RapportDTO.Output> listerRapports() {
        return rapportRepository.findAll()
                .stream()
                .map(rapportMapper::toOutput)
                .toList();
    }

    @Override
    public RapportDTO.Output recupererRapport(Long id) {
        if (id == null) {
            throw new ElementNull("L'ID du rapport ne peut pas être null");
        }
        return rapportRepository.findById(id)
                .map(rapportMapper::toOutput)
                .orElseThrow(() ->
                        new ElementNonTrouver("Rapport non trouvé avec l'ID : " + id));
    }

    @Override
    public RapportDTO.Output ajouterRapport(MultipartFile file, RapportDTO.CreateInput dto) throws IOException {
        if (file == null || dto == null) {
            throw new ElementNull("Fichier ou données manquants");
        }

        if (rapportRepository.existsByStageId(dto.getIdStage())) {
            throw new ElementDejaExistant("Un rapport existe déjà pour ce stage");
        }

        Rapport rapport = rapportMapper.toEntity(dto);

        rapport.setFichierNom(file.getOriginalFilename());
        rapport.setFichierType(file.getContentType());
        rapport.setFichierData(file.getBytes());

        rapport.setDateSoumission(LocalDateTime.now());
        rapport.setStatutRapport(StatutRapportEnum.BROUILLON);

        Rapport saved = rapportRepository.save(rapport);
        return rapportMapper.toOutput(saved);
    }

    public List<RapportDTO.Output> getRapportsParEncadrant(Long idEncadrant) {
        return rapportRepository
                .findByStageEncadrantId(idEncadrant)
                .stream()
                .map(rapportMapper::toOutput)
                .toList();
    }

    @Override
    public List<RapportDTO.Output> listerRapportsParStage(Long stageId) {
        if (stageId == null) {
            throw new ElementNull("L'ID du stage ne peut pas être null");
        }
        return rapportRepository.findByStageId(stageId)
                .stream()
                .map(rapportMapper::toOutput)
                .toList();
    }

    @Override
    public RapportDTO.Output modifierRapport(Long id, RapportDTO.UpdateInput dto) {
        if (dto == null) {
            throw new ElementNull("Le rapport à modifier est null");
        }

        Rapport rapport = rapportRepository.findById(id)
                .orElseThrow(() ->
                        new ElementNonTrouver("Rapport non trouvé avec l'ID : " + id));

        rapportMapper.updateEntity(dto, rapport);
        Rapport updated = rapportRepository.save(rapport);
        return rapportMapper.toOutput(updated);
    }

    @Override
    public RapportDTO.Output changerStatut(Long id, StatutRapportEnum statut) {
        if (id == null || statut == null) {
            throw new ElementNull("ID ou statut null");
        }

        Rapport rapport = rapportRepository.findById(id)
                .orElseThrow(() ->
                        new ElementNonTrouver("Rapport non trouvé avec l'ID : " + id));

        rapport.setStatutRapport(statut);
        Rapport updated = rapportRepository.save(rapport);
        return rapportMapper.toOutput(updated);
    }

    @Override
    public void supprimerRapport(Long id) {
        if (id == null) {
            throw new ElementNull("L'ID du rapport ne peut pas être null");
        }

        Rapport rapport = rapportRepository.findById(id)
                .orElseThrow(() ->
                        new ElementNonTrouver("Rapport non trouvé avec l'ID : " + id));

        // récupérer le stage lié au rapport
        Stage stage = rapport.getStage();

        if (stage != null) {
            // On dit au Stage qu'il n'a plus de Rapport
            stage.setRapport(null);

            // On dit au Rapport qu'il n'a plus de Stage
            rapport.setStage(null);
        }

        rapportRepository.delete(rapport);
    }
}