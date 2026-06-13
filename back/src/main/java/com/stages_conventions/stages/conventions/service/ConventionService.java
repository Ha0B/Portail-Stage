package com.stages_conventions.stages.conventions.service;

import com.stages_conventions.stages.conventions.dto.ConventionDTO;
import com.stages_conventions.stages.conventions.dto.SignatureDTO;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;

public interface ConventionService {

    ConventionDTO.Output trouverConvention(Long idConvention);

    List<ConventionDTO.Output> listerConventions();

    ConventionDTO.Output ajouterConvention(ConventionDTO.CreateInput input);

    ConventionDTO.Output modifierConvention(Long id, ConventionDTO.UpdateInput input);

    void supprimerConvention(Long idConvention);

    List<ConventionDTO.Output> recupererConventionsByEtudiant(Long etudiantId);

    void envoyerOtp(Long idConvention);

    // Signature modifiée pour accepter la signatureImage
    ConventionDTO.Output validerOtpEtSigner(Long idConvention, String otpFourni, String ipAddress, String userAgent, String signatureImage);

    SignatureDTO.Response obtenirStatutSignature(Long idConvention);

    void genererPdf(Long idConvention, HttpServletResponse response) throws Exception;
}