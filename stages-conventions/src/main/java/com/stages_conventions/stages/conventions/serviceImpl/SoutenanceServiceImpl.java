package com.stages_conventions.stages.conventions.serviceImpl;

import com.stages_conventions.stages.conventions.dto.SoutenanceDTO;
import com.stages_conventions.stages.conventions.model.Soutenance;
import com.stages_conventions.stages.conventions.model.Stage;
import com.stages_conventions.stages.conventions.enums.StatutSoutenanceEnum;
import com.stages_conventions.stages.conventions.exception.ElementDejaExistant;
import com.stages_conventions.stages.conventions.exception.ElementNonTrouver;
import com.stages_conventions.stages.conventions.exception.ElementNull;
import com.stages_conventions.stages.conventions.mapper.SoutenanceMapper;
import com.stages_conventions.stages.conventions.repository.SoutenanceRepository;
import com.stages_conventions.stages.conventions.repository.StageRepository;
import com.stages_conventions.stages.conventions.service.SoutenanceService;

import org.springframework.transaction.annotation.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class SoutenanceServiceImpl implements SoutenanceService {

    private final SoutenanceRepository soutenanceRepository;
    private final StageRepository stageRepository;
    private final SoutenanceMapper soutenanceMapper;

    // =============== METHODE PRIVEE ===============
    private Soutenance recupererSoutenanceEntity(Long id) {
        if (id == null || id <= 0) {
            throw new ElementNull("ID de la soutenance invalide !");
        }
        return soutenanceRepository.findById(id)
                .orElseThrow(() -> new ElementNonTrouver("Soutenance introuvable !"));
    }

    // =============== LISTE ===============
    @Override
    public List<SoutenanceDTO.Output> listeSoutenance() {
        return soutenanceRepository.findAll().stream()
                .map(soutenanceMapper::toOutput)
                .collect(Collectors.toList());
    }

    // =============== RECHERCHE PAR ID ===============
    @Override
    public SoutenanceDTO.Output trouverSoutenance(Long id) {
        return soutenanceMapper.toOutput(recupererSoutenanceEntity(id));
    }

    // =============== RECHERCHE PAR ETUDIANT ===============
    @Override
    public SoutenanceDTO.Output recupererSoutenanceParEtudiant(Long idEtudiant) {

        Soutenance soutenance = soutenanceRepository.findByStage_Etudiant_Id(idEtudiant);

        if (soutenance == null) {
            throw new ElementNonTrouver("Aucune soutenance trouvée pour cet étudiant !");
        }

        return soutenanceMapper.toOutput(soutenance);
    }

    // =============== RECHERCHE PAR ENCADRANT ===============
    @Override
    public List<SoutenanceDTO.Output> recupererSoutenancesParJuryEncadrant(Long idEncadrant) {
        List<Soutenance> soutenances = soutenanceRepository.findSoutenancesByJuryEncadrantId(idEncadrant);
        return soutenances.stream()
                .map(soutenanceMapper::toOutput) // Adaptez selon votre mapper (MapStruct ou manuel)
                .collect(Collectors.toList());
    }

    // =============== AJOUTER ===============
    @Override
    @Transactional // Surcharge pour autoriser l'écriture en base
    public SoutenanceDTO.Output creerSoutenance(SoutenanceDTO.CreateInput input) {
        if (input == null) throw new ElementNull("Données de la soutenance manquantes !");

        Stage stage = stageRepository.findById(input.getIdStage())
                .orElseThrow(() -> new ElementNonTrouver("Stage introuvable !"));

        if (soutenanceRepository.findByStage(stage) != null) {
            throw new ElementDejaExistant("Ce stage possède déjà une soutenance !");
        }

        if (soutenanceRepository.findBySalleAndDateAndHeure(input.getSalle(), input.getDate(), input.getHeure()) != null) {
            throw new ElementDejaExistant("Salle déjà réservée à cette date et heure !");
        }

        if (input.getDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("La date de la soutenance ne peut pas être dans le passé !");
        }

        Soutenance soutenance = soutenanceMapper.toEntity(input, stage);
        soutenance.setStatut(StatutSoutenanceEnum.PLANIFIEE);

        return soutenanceMapper.toOutput(soutenanceRepository.save(soutenance));
    }

    // =============== MODIFICATION ===============
    @Override
    @Transactional
    public SoutenanceDTO.Output modifierSoutenance(Long id, SoutenanceDTO.UpdateInput input) {
        if (input == null) throw new ElementNull("Données de modification invalides !");

        Soutenance trouver = recupererSoutenanceEntity(id);

        soutenanceMapper.updateEntity(input, trouver);

        // NOUVEAU : Validation pour empêcher de repousser une soutenance dans le passé
        if (trouver.getDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("La date de la soutenance ne peut pas être dans le passé !");
        }

        Soutenance conflit = soutenanceRepository.findBySalleAndDateAndHeure(
                trouver.getSalle(), trouver.getDate(), trouver.getHeure()
        );
        if (conflit != null && !conflit.getId().equals(id)) {
            throw new ElementDejaExistant("Salle déjà réservée à cette date et heure !");
        }

        if (input.getIdStage() != null && !input.getIdStage().equals(trouver.getStage().getId())) {
            Stage newStage = stageRepository.findById(input.getIdStage())
                    .orElseThrow(() -> new ElementNonTrouver("Nouveau stage introuvable !"));

            Soutenance existante = soutenanceRepository.findByStage(newStage);
            if (existante != null && !existante.getId().equals(id)) {
                throw new ElementDejaExistant("Le nouveau stage possède déjà une soutenance !");
            }
            trouver.setStage(newStage);
        }

        return soutenanceMapper.toOutput(soutenanceRepository.save(trouver));
    }

    // =============== SUPPRESSION ===============
    @Override
    @Transactional
    public boolean supprimerSoutenance(Long id) {
        Soutenance trouver = recupererSoutenanceEntity(id);
        soutenanceRepository.delete(trouver);
        return true;
    }

    // =============== RECHERCHE PAR SALLE ===============
    @Override
    public List<SoutenanceDTO.Output> trouverParSalle(String salle) {
        if (salle == null || salle.trim().isEmpty()) throw new ElementNull("Nom de salle invalide !");
        return soutenanceRepository.findBySalle(salle).stream()
                .map(soutenanceMapper::toOutput)
                .collect(Collectors.toList());
    }

    // =============== RECHERCHE PAR DATE ===============
    @Override
    public List<SoutenanceDTO.Output> trouverParDate(LocalDate date) {
        if (date == null) throw new ElementNull("Date invalide !");
        return soutenanceRepository.findByDate(date).stream()
                .map(soutenanceMapper::toOutput)
                .collect(Collectors.toList());
    }

    // =============== PLANNING ===============
    @Override
    public List<SoutenanceDTO.Output> planning() {
        return soutenanceRepository.findAllByOrderByDateAscHeureAsc().stream()
                .map(soutenanceMapper::toOutput)
                .collect(Collectors.toList());
    }
}