package com.stages_conventions.stages.conventions.serviceImpl;

import com.stages_conventions.stages.conventions.Util.OtpService;
import com.stages_conventions.stages.conventions.enums.RoleEnum;
import com.stages_conventions.stages.conventions.enums.StatutConventionEnum;
import com.stages_conventions.stages.conventions.enums.StatutSignatureEnum;
import com.stages_conventions.stages.conventions.exception.InvalidOtpException;
import com.stages_conventions.stages.conventions.model.Convention;
import com.stages_conventions.stages.conventions.model.Signature;
import com.stages_conventions.stages.conventions.model.Utilisateur;
import com.stages_conventions.stages.conventions.repository.ConventionRepository;
import com.stages_conventions.stages.conventions.repository.SignatureRepository;
import com.stages_conventions.stages.conventions.service.SignatureService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class SignatureServiceImpl implements SignatureService {

    private final SignatureRepository signatureRepository;
    private final ConventionRepository conventionRepository;
    private final OtpService otpService;

    @Override
    public Signature signerConvention(
            Convention convention,
            Utilisateur signataire,
            String otp,
            String ip,
            String userAgent,
            String signatureImage) {

        if (!otpService.validerOtp(convention.getId(), otp)) {
            throw new InvalidOtpException("OTP invalide ou expiré.");
        }

        if (signatureRepository.existsByConventionIdAndSignataireId(
                convention.getId(),
                signataire.getId())) {
            throw new RuntimeException("Vous avez déjà signé cette convention.");
        }

        Signature signature = new Signature();
        signature.setConvention(convention);
        signature.setSignataire(signataire);
        signature.setHorodatage(LocalDateTime.now());
        signature.setAdresseIp(ip);
        signature.setUserAgent(userAgent);
        signature.setSha256Document(convention.getSha256Hash());
        signature.setStatut(StatutSignatureEnum.SIGNEE);

        if (signatureImage != null && !signatureImage.isBlank()) {
            signature.setSignatureImage(signatureImage);
        }

        Signature savedSignature = signatureRepository.save(signature);

        if (signataire.getRole() == RoleEnum.ENTREPRISE) {

            convention.setStatut(
                    StatutConventionEnum.SIGNEE_PAR_ENTREPRISE);

            convention.setSignee(true);

            if (signatureImage != null && !signatureImage.isBlank()) {
                convention.setSignatureImage(signatureImage);
            }
        }

        conventionRepository.save(convention);

        return savedSignature;
    }

    @Override
    public boolean aDejaSigne(Long conventionId, Long utilisateurId) {
        return signatureRepository.existsByConventionIdAndSignataireId(conventionId, utilisateurId);
    }

    @Override
    public List<Signature> getByConventionId(Long conventionId) {
        return signatureRepository.findByConventionId(conventionId);
    }

    @Override
    public boolean estSignee(Long conventionId) {
        Convention convention = conventionRepository.findById(conventionId)
                .orElseThrow(() -> new RuntimeException("Convention introuvable"));
        return Boolean.TRUE.equals(convention.getSignee());
    }
}