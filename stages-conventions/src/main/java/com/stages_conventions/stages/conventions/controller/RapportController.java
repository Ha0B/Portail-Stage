package com.stages_conventions.stages.conventions.controller;

import com.stages_conventions.stages.conventions.dto.RapportDTO;
import com.stages_conventions.stages.conventions.enums.StatutRapportEnum;
import com.stages_conventions.stages.conventions.model.Rapport;
import com.stages_conventions.stages.conventions.service.RapportService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
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
@RequestMapping("/rapport")
@AllArgsConstructor
public class RapportController {

    private final RapportService rapportService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','ETUDIANT','JURY','ENCADRANT')")
    @ResponseStatus(HttpStatus.OK)
    public List<RapportDTO.Output> listerRapports() {
        return rapportService.listerRapports();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ETUDIANT','JURY','ENCADRANT')")
    @ResponseStatus(HttpStatus.OK)
    public RapportDTO.Output recupererRapport(@PathVariable Long id) {
        return rapportService.recupererRapport(id);
    }

    @GetMapping("/stage/{stageId}")
    @PreAuthorize("hasAnyRole('ADMIN','ETUDIANT','JURY','ENCADRANT')")
    @ResponseStatus(HttpStatus.OK)
    public List<RapportDTO.Output> listerRapportsParStage(
            @PathVariable Long stageId) {

        return rapportService.listerRapportsParStage(stageId);
    }

    @PostMapping
    @PreAuthorize("hasRole('ETUDIANT')")
    @ResponseStatus(HttpStatus.CREATED)
    public RapportDTO.Output ajouterRapport(

            @RequestPart("file")
            MultipartFile file,

            @RequestPart("rapportInput")
            RapportDTO.CreateInput dto

    ) throws IOException {

        return rapportService.ajouterRapport(
                file,
                dto
        );
    }

    @GetMapping("/encadrant/{idEncadrant}")
    @PreAuthorize("hasAnyRole('ENCADRANT','ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public List<RapportDTO.Output> getRapportsEncadrant(
            @PathVariable Long idEncadrant) {

        return rapportService.getRapportsParEncadrant(idEncadrant);
    }
    @GetMapping("/{id}/fichier")
    @PreAuthorize(
            "hasAnyRole('ENTREPRISE','JURY','ENCADRANT','ADMIN')"
    )
    public ResponseEntity<byte[]> afficherRapport(
            @PathVariable Long id
    ){

        Rapport rapport =
                rapportService.recupererRapportEntity(id);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\""
                                + rapport.getFichierNom()
                                + "\""
                )
                .contentType(
                        MediaType.parseMediaType(
                                rapport.getFichierType()
                        )
                )
                .body(
                        rapport.getFichierData()
                );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ETUDIANT')")
    @ResponseStatus(HttpStatus.OK)
    public RapportDTO.Output modifierRapport(
            @PathVariable Long id,
            @Valid @RequestBody RapportDTO.UpdateInput dto) {

        return rapportService.modifierRapport(id, dto);
    }

    @PutMapping("/{id}/statut")
    @PreAuthorize("hasAnyRole('ENCADRANT','ENTREPRISE','ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public RapportDTO.Output changerStatut(
            @PathVariable Long id,
            @RequestParam StatutRapportEnum statut) {

        return rapportService.changerStatut(id, statut);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ETUDIANT')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void supprimerRapport(@PathVariable Long id) {

        rapportService.supprimerRapport(id);
    }
}