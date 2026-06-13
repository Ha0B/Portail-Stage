package com.stages_conventions.stages.conventions.controller;

import com.stages_conventions.stages.conventions.dto.ConventionDTO;
import com.stages_conventions.stages.conventions.dto.SignatureDTO;
import com.stages_conventions.stages.conventions.service.ConventionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/conventions")
@RequiredArgsConstructor
public class ConventionController {

    private final ConventionService conventionService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','ENTREPRISE')")
    @ResponseStatus(HttpStatus.OK)
    public List<ConventionDTO.Output> listerConventions() {
        return conventionService.listerConventions();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ENTREPRISE','ETUDIANT')")
    @ResponseStatus(HttpStatus.OK)
    public ConventionDTO.Output trouverConvention(@PathVariable Long id) {
        return conventionService.trouverConvention(id);
    }

    @GetMapping("/etudiant/{id}")
    @PreAuthorize("hasAnyRole('ETUDIANT','ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public List<ConventionDTO.Output> recupererConventionsEtudiant(@PathVariable Long id) {
        return conventionService.recupererConventionsByEtudiant(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public ConventionDTO.Output creerConvention(@Valid @RequestBody ConventionDTO.CreateInput conventionInput) {
        return conventionService.ajouterConvention(conventionInput);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public ConventionDTO.Output modifierConvention(
            @PathVariable Long id,
            @Valid @RequestBody ConventionDTO.UpdateInput conventionInput) {
        return conventionService.modifierConvention(id, conventionInput);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void supprimerConvention(@PathVariable Long id) {
        conventionService.supprimerConvention(id);
    }

    @GetMapping("/{id}/genererPdf")
    @PreAuthorize("hasAnyRole('ADMIN','ETUDIANT','ENTREPRISE')")
    @ResponseStatus(HttpStatus.OK)
    public void genererPdf(@PathVariable Long id, HttpServletResponse response) throws Exception {
        conventionService.genererPdf(id, response);
    }

    @PostMapping("/{id}/otp")
    @PreAuthorize("hasAnyRole('ETUDIANT','ENTREPRISE','ENCADRANT')")
    public void envoyerOtp(@PathVariable Long id) {
        conventionService.envoyerOtp(id);
    }

    @PostMapping("/{id}/valider-otp")
    @PreAuthorize("hasAnyRole('ETUDIANT','ENTREPRISE','ENCADRANT')")
    public ConventionDTO.Output validerOtpEtSigner(
            @PathVariable Long id,
            @RequestBody SignatureDTO.OtpRequest otpRequest,
            HttpServletRequest httpRequest) {

        String ip = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");

        return conventionService.validerOtpEtSigner(
                id,
                otpRequest.getOtp(),
                ip,
                userAgent,
                otpRequest.getSignatureImage()
        );
    }

    @GetMapping("/{id}/signature")
    @PreAuthorize("hasAnyRole('ADMIN','ETUDIANT','ENTREPRISE')")
    public SignatureDTO.Response getSignatureStatus(@PathVariable Long id) {
        return conventionService.obtenirStatutSignature(id);
    }
}