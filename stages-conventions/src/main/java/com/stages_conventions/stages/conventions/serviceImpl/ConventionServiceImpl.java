package com.stages_conventions.stages.conventions.serviceImpl;

import com.stages_conventions.stages.conventions.Util.OtpService;
import com.stages_conventions.stages.conventions.Util.PdfService;
import com.stages_conventions.stages.conventions.dto.ConventionDTO;
import com.stages_conventions.stages.conventions.dto.SignatureDTO;
import com.stages_conventions.stages.conventions.model.Convention;
import com.stages_conventions.stages.conventions.model.Stage;
import com.stages_conventions.stages.conventions.model.Utilisateur;
import com.stages_conventions.stages.conventions.enums.StatutConventionEnum;
import com.stages_conventions.stages.conventions.exception.*;
import com.stages_conventions.stages.conventions.mapper.ConventionMapper;
import com.stages_conventions.stages.conventions.repository.ConventionRepository;
import com.stages_conventions.stages.conventions.repository.StageRepository;
import com.stages_conventions.stages.conventions.service.ConventionService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ConventionServiceImpl implements ConventionService {

    private final ConventionRepository conventionRepository;
    private final StageRepository stageRepository;
    private final ConventionMapper conventionMapper;
    private final SignatureServiceImpl signatureService;
    private final OtpService otpService;
    private final UtilisateurServiceImpl utilisateurService;
    private final PdfService pdfService;

    private Convention getConventionEntity(Long idConvention) {
        if (idConvention == null || idConvention <= 0) {
            throw new IllegalArgumentException("ID de convention invalide");
        }
        return conventionRepository.findById(idConvention)
                .orElseThrow(() -> new ElementNonTrouver("Convention introuvable"));
    }

    @Override
    public ConventionDTO.Output trouverConvention(Long idConvention) {
        return conventionMapper.toOutput(getConventionEntity(idConvention));
    }

    @Override
    public List<ConventionDTO.Output> listerConventions() {
        return conventionRepository.findAll()
                .stream()
                .map(conventionMapper::toOutput)
                .collect(Collectors.toList());
    }

    @Override
    public ConventionDTO.Output ajouterConvention(ConventionDTO.CreateInput input) {
        Stage stage = stageRepository.findById(input.getStageId())
                .orElseThrow(() -> new ElementNonTrouver("Stage introuvable"));

        if (conventionRepository.findByStage(stage) != null) {
            throw new ElementDejaExistant("Une convention existe déjà pour ce stage");
        }
        if (input.getDateDebut().isAfter(input.getDateFin())) {
            throw new ErreurDate("La date de début doit être antérieure à la date de fin");
        }

        Convention convention = conventionMapper.toEntity(input, stage);
        convention.setStatut(StatutConventionEnum.EN_ATTENTE);

        Convention savedConvention = conventionRepository.save(convention);
        log.info("Convention créée pour le stage ID: {}", stage.getId());
        return conventionMapper.toOutput(savedConvention);
    }

    @Override
    public ConventionDTO.Output modifierConvention(Long id, ConventionDTO.UpdateInput input) {
        Convention oldConvention = getConventionEntity(id);
        if (oldConvention.getStatut() != StatutConventionEnum.EN_ATTENTE) {
            throw new ActionNonAutoriseeException("Impossible de modifier une convention déjà signée.");
        }
        conventionMapper.updateEntity(input, oldConvention);
        if (oldConvention.getDateDebut() != null && oldConvention.getDateFin() != null) {
            if (oldConvention.getDateDebut().isAfter(oldConvention.getDateFin())) {
                throw new ErreurDate("La date de début doit être antérieure à la date de fin");
            }
        }
        if (input.getStageId() != null && !input.getStageId().equals(oldConvention.getStage().getId())) {
            Stage newStage = stageRepository.findById(input.getStageId())
                    .orElseThrow(() -> new ElementNonTrouver("Nouveau stage introuvable"));
            Convention existingConvention = conventionRepository.findByStage(newStage);
            if (existingConvention != null && !existingConvention.getId().equals(id)) {
                throw new ElementDejaExistant("Ce nouveau stage possède déjà une convention");
            }
            oldConvention.setStage(newStage);
        }
        log.info("Convention modifiée - ID: {}", id);
        return conventionMapper.toOutput(conventionRepository.save(oldConvention));
    }

    @Override
    public void supprimerConvention(Long idConvention) {
        Convention oldConvention = getConventionEntity(idConvention);
        if (oldConvention.getStatut() != StatutConventionEnum.EN_ATTENTE) {
            throw new ActionNonAutoriseeException("Impossible de supprimer une convention déjà signée.");
        }
        conventionRepository.delete(oldConvention);
        log.info("Convention supprimée - ID: {}", idConvention);
    }

    @Override
    public List<ConventionDTO.Output> recupererConventionsByEtudiant(Long etudiantId) {
        return conventionRepository.findByStageEtudiantId(etudiantId)
                .stream()
                .map(conventionMapper::toOutput)
                .collect(Collectors.toList());
    }

    @Override
    public void envoyerOtp(Long idConvention) {
        Convention convention = getConventionEntity(idConvention);
        if (Boolean.TRUE.equals(convention.getSignee())) {
            throw new StatutInvalideException("Convention déjà totalement signée.");
        }
        if (convention.getSha256Hash() == null) {
            throw new ElementNonTrouver("Le document PDF doit être généré avant de pouvoir demander une signature.");
        }
        Utilisateur currentUser = utilisateurService.getCurrentUser();
        otpService.envoyerOtp(idConvention, currentUser.getEmail());
        log.info("OTP envoyé avec succès pour la convention ID: {}", idConvention);
    }

    @Override
    public ConventionDTO.Output validerOtpEtSigner(Long idConvention, String otpFourni, String ipAddress, String userAgent, String signatureImage) {
        Convention convention = getConventionEntity(idConvention);
        if (Boolean.TRUE.equals(convention.getSignee())) {
            throw new StatutInvalideException("Convention déjà complétée.");
        }
        Utilisateur signataire = utilisateurService.getCurrentUser();
        signatureService.signerConvention(convention, signataire, otpFourni, ipAddress, userAgent, signatureImage);
        Convention conventionSignee = getConventionEntity(idConvention);
        log.info("Convention scellée et signée avec succès - ID: {}", idConvention);
        return conventionMapper.toOutput(conventionSignee);
    }

    @Override
    public SignatureDTO.Response obtenirStatutSignature(Long idConvention) {
        Convention convention = getConventionEntity(idConvention);
        SignatureDTO.Response response = new SignatureDTO.Response();
        response.setIdConvention(idConvention);
        response.setStatut(convention.getStatut());
        return response;
    }

    @Override
    public void genererPdf(Long idConvention, HttpServletResponse response) throws Exception {
        Convention convention = getConventionEntity(idConvention);
        pdfService.genererConventionPdf(response, convention);
    }
}