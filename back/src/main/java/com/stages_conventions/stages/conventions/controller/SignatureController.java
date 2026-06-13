package com.stages_conventions.stages.conventions.controller;

import com.stages_conventions.stages.conventions.dto.ConventionDTO;
import com.stages_conventions.stages.conventions.dto.SignatureDTO;
import com.stages_conventions.stages.conventions.service.ConventionService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/signatures")
@AllArgsConstructor
public class SignatureController {

    private final ConventionService conventionService;

    @PostMapping("/{conventionId}/envoyer-otp")
    @PreAuthorize("hasRole('ENTREPRISE')")
    @ResponseStatus(HttpStatus.OK)
    public void envoyerOtp(@PathVariable Long conventionId) {
        conventionService.envoyerOtp(conventionId);
    }

    @PostMapping("/{conventionId}/valider-otp")
    @PreAuthorize("hasRole('ENTREPRISE')")
    @ResponseStatus(HttpStatus.OK)
    public ConventionDTO.Output validerOtpEtSigner(
            @PathVariable Long conventionId,
            @RequestBody SignatureDTO.OtpRequest otpRequest,
            HttpServletRequest request) {

        String ipAddress = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");

        return conventionService.validerOtpEtSigner(
                conventionId,
                otpRequest.getOtp(),
                ipAddress,
                userAgent,
                otpRequest.getSignatureImage()
        );
    }

    @GetMapping("/{conventionId}/statut")
    @PreAuthorize("hasAnyRole('ADMIN','ETUDIANT','ENTREPRISE')")
    @ResponseStatus(HttpStatus.OK)
    public SignatureDTO.Response obtenirStatutSignature(@PathVariable Long conventionId) {
        return conventionService.obtenirStatutSignature(conventionId);
    }
}