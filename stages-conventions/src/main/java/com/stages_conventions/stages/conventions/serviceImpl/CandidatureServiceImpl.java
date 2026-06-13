package com.stages_conventions.stages.conventions.serviceImpl;

import com.stages_conventions.stages.conventions.dto.CandidatureDTO;
import com.stages_conventions.stages.conventions.model.Candidature;
import com.stages_conventions.stages.conventions.model.Etudiant;
import com.stages_conventions.stages.conventions.model.Offre;
import com.stages_conventions.stages.conventions.enums.StatutCandidatureEnum;
import com.stages_conventions.stages.conventions.exception.ElementDejaExistant;
import com.stages_conventions.stages.conventions.exception.ElementNonTrouver;
import com.stages_conventions.stages.conventions.exception.ElementNull;
import com.stages_conventions.stages.conventions.mapper.CandidatureMapper;
import com.stages_conventions.stages.conventions.model.Stage;
import com.stages_conventions.stages.conventions.repository.CandidatureRepository;
import com.stages_conventions.stages.conventions.repository.EtudiantRepository;
import com.stages_conventions.stages.conventions.repository.OffreRepository;
import com.stages_conventions.stages.conventions.repository.StageRepository;
import com.stages_conventions.stages.conventions.service.CandidatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CandidatureServiceImpl implements CandidatureService {

    private final CandidatureRepository candidatureRepository;
    private final EtudiantRepository etudiantRepository;
    private final OffreRepository offreRepository;
    private final CandidatureMapper candidatureMapper;
    private final StageRepository stageRepository;

    @Override
    public CandidatureDTO.Output soummettre(MultipartFile file, CandidatureDTO.CreateInput input) throws IOException {
        if (file == null || input == null) {
            throw new ElementNull("le fichier ou les donnees sont vides impossible de candidate ");
        }

        Etudiant etudiant = etudiantRepository.findById(input.getIdEtudiant())
                .orElseThrow(() -> new ElementNonTrouver("Étudiant introuvable"));

        Offre offre = offreRepository.findById(input.getIdOffre())
                .orElseThrow(() -> new ElementNonTrouver("Offre introuvable"));

        Candidature existante = candidatureRepository.findByEtudiantAndOffre(etudiant, offre);
        if (existante != null) {
            throw new ElementDejaExistant("Vous avez déjà postulé à cette offre");
        }

        Candidature candidature = candidatureMapper.toEntity(input, etudiant, offre);

        candidature.setCvNom(file.getOriginalFilename());
        candidature.setCvType(file.getContentType());
        candidature.setCvData(file.getBytes());

        candidature.setDateCandidature();
        candidature.setStatut(StatutCandidatureEnum.EN_ATTENTE);

        Candidature saved = candidatureRepository.save(candidature);
        return candidatureMapper.toOutput(saved);
    }

    @Override
    @Transactional
    public CandidatureDTO.Output accepterCandidature(Long id) {
        if (id == null) {
            throw new ElementNull("l'id de candidature introuvable");
        }

        Candidature candidature = recupererCandidatureEntity(id);
        Offre offre = candidature.getOffre();
        int dureeMois = offre.getDuree();

        if (candidature.getStatut() == StatutCandidatureEnum.ACCEPTEE) {
            throw new ElementDejaExistant("Déjà acceptée");
        }
        if (candidature.getStatut() == StatutCandidatureEnum.REFUSEE) {
            throw new ElementNull("Impossible d'accepter une candidature refusée");
        }

        candidature.setStatut(StatutCandidatureEnum.ACCEPTEE);
        candidatureRepository.save(candidature);

        Stage stage = new Stage();
        stage.setDateDebut(LocalDate.now());
        stage.setDateFin(LocalDate.now().plusMonths(dureeMois));
        stage.setTitre(offre.getTitre());
        stage.setDescription(offre.getDescription());
        stage.setEtudiant(candidature.getEtudiant());
        stage.setEntreprise(offre.getEntreprise());
        stageRepository.save(stage);

        return candidatureMapper.toOutput(candidature);
    }

    @Override
    public CandidatureDTO.Output refuserCandidature(Long id) {
        Candidature candidature = recupererCandidatureEntity(id);

        if (candidature.getStatut() == StatutCandidatureEnum.REFUSEE) {
            throw new ElementDejaExistant("Déjà refusée");
        }
        if (candidature.getStatut() == StatutCandidatureEnum.ACCEPTEE) {
            throw new ElementNull("Impossible de refuser une candidature acceptée");
        }

        candidature.setStatut(StatutCandidatureEnum.REFUSEE);
        return candidatureMapper.toOutput(candidatureRepository.save(candidature));
    }

    @Override
    public void annulerCandidature(Long id) {
        Candidature candidature = recupererCandidatureEntity(id);

        if (candidature.getStatut() == StatutCandidatureEnum.ACCEPTEE) {
            throw new ElementNull("Impossible d'annuler une candidature acceptée");
        }
        candidatureRepository.delete(candidature);
    }

    @Override
    public CandidatureDTO.Output recupererCandidature(Long id) {
        return candidatureMapper.toOutput(recupererCandidatureEntity(id));
    }

    @Override
    public List<CandidatureDTO.Output> listerCandidatures() {
        return candidatureRepository.findAll()
                .stream()
                .map(candidatureMapper::toOutput)
                .collect(Collectors.toList());
    }

    @Override
    public CandidatureDTO.Output modifierCandidature(Long id, CandidatureDTO.UpdateInput input) {
        if (input == null) {
            throw new ElementNull("Données de modification invalides");
        }

        Candidature existante = recupererCandidatureEntity(id);

        if (existante.getStatut() != StatutCandidatureEnum.EN_ATTENTE) {
            throw new ElementNull("Impossible de modifier une candidature " + existante.getStatut());
        }

        candidatureMapper.updateEntity(input, existante);
        return candidatureMapper.toOutput(candidatureRepository.save(existante));
    }

    @Override
    public List<CandidatureDTO.Output> recupererCandidaturesEtudiant(Long etudiantId) {
        if (etudiantId == null || etudiantId <= 0) {
            throw new ElementNull("ID étudiant invalide");
        }
        return candidatureRepository.findByEtudiantId(etudiantId)
                .stream()
                .map(candidatureMapper::toOutput)
                .collect(Collectors.toList());
    }

    @Override
    public List<CandidatureDTO.Output> recupererCandidaturesOffre(Long offreId) {
        if (offreId == null || offreId <= 0) {
            throw new ElementNull("ID offre invalide");
        }
        return candidatureRepository.findByOffreId(offreId)
                .stream()
                .map(candidatureMapper::toOutput)
                .collect(Collectors.toList());
    }

    @Override
    public byte[] recupererCv(Long candidatureId) {
        Candidature candidature = recupererCandidatureEntity(candidatureId);

        if (candidature.getCvData() == null) {
            throw new ElementNonTrouver("CV introuvable");
        }
        return candidature.getCvData();
    }

    // Méthode utilitaire privée, non exposée dans l'interface
    private Candidature recupererCandidatureEntity(Long id) {
        if (id == null || id <= 0) {
            throw new ElementNull("ID candidature invalide");
        }
        return candidatureRepository.findById(id)
                .orElseThrow(() -> new ElementNonTrouver("Candidature introuvable"));
    }
}