package com.stages_conventions.stages.conventions.controller;

import com.stages_conventions.stages.conventions.dto.CandidatureDTO;
import com.stages_conventions.stages.conventions.service.CandidatureService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/candidature")
@RequiredArgsConstructor
public class CandidatureController {

    private final CandidatureService candidatureService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','ENTREPRISE')")
    @ResponseStatus(HttpStatus.OK)
    public List<CandidatureDTO.Output> recupererCandidatures() {
        return candidatureService.listerCandidatures();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ENTREPRISE')")
    @ResponseStatus(HttpStatus.OK)
    public CandidatureDTO.Output recupererCandidatureParId(@PathVariable Long id) {
        return candidatureService.recupererCandidature(id);
    }

    @GetMapping("/etudiant/{id}")
    @PreAuthorize("hasAnyRole('ETUDIANT','ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public List<CandidatureDTO.Output> recupererCandidaturesEtudiant(
            @PathVariable Long id) {

        return candidatureService.recupererCandidaturesEtudiant(id);
    }

    @GetMapping("/offre/{id}")
    @PreAuthorize("hasAnyRole('ENTREPRISE','ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public List<CandidatureDTO.Output> recupererCandidaturesOffre(
            @PathVariable Long id) {

        return candidatureService.recupererCandidaturesOffre(id);
    }

    @GetMapping("/{id}/cv")
    @PreAuthorize("hasAnyRole('ENTREPRISE','ADMIN')")
    public ResponseEntity<byte[]> afficherCv(@PathVariable Long id) {
        CandidatureDTO.Output dto = candidatureService.recupererCandidature(id);
        byte[] cvData = candidatureService.recupererCv(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + dto.getCvNom() + "\"")
                .contentType(MediaType.parseMediaType(dto.getCvType()))
                .body(cvData);
    }

    @PreAuthorize("hasRole('ETUDIANT')")
    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    public CandidatureDTO.Output postulerCandidature(
            @RequestPart("file") MultipartFile file,
            @RequestPart("candidatureInput")
            CandidatureDTO.CreateInput candidatureInput
    )            throws IOException {

        return candidatureService.soummettre(file, candidatureInput);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ETUDIANT')")
    @ResponseStatus(HttpStatus.OK)
    public CandidatureDTO.Output modifierCandidature(
            @PathVariable Long id,
            @Valid @RequestBody CandidatureDTO.UpdateInput candidatureInput) {

        return candidatureService.modifierCandidature(id, candidatureInput);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ETUDIANT','ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public String supprimerCandidature(@PathVariable Long id) {

        candidatureService.annulerCandidature(id);

        return "Candidature supprimée avec succès";
    }

    @PutMapping("/{id}/accepter")
    @PreAuthorize("hasRole('ENTREPRISE')")
    @ResponseStatus(HttpStatus.OK)
    public CandidatureDTO.Output accepterCandidature(
            @PathVariable Long id) {

        return candidatureService.accepterCandidature(id);
    }

    @PutMapping("/{id}/refuser")
    @PreAuthorize("hasRole('ENTREPRISE')")
    @ResponseStatus(HttpStatus.OK)
    public CandidatureDTO.Output refuserCandidature(
            @PathVariable Long id) {

        return candidatureService.refuserCandidature(id);
    }

}