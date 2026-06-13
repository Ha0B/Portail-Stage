package com.stages_conventions.stages.conventions.controller;

import com.stages_conventions.stages.conventions.enums.StatutCandidatureEnum;
import com.stages_conventions.stages.conventions.enums.StatutConventionEnum;
import com.stages_conventions.stages.conventions.service.CsvService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/export")
public class CsvController {

    private final CsvService csvService;

    @GetMapping("/candidatures")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> exportCandidatures(
            @Valid @RequestParam Long offreId,
            @RequestParam(required = false) String promo,
            @RequestParam(required = false) StatutCandidatureEnum statut)
            throws IOException {

        ByteArrayInputStream excelFile =
                csvService.exportCandidatures(
                        offreId,
                        promo,
                        statut
                );

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=candidatures.xlsx"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .body(excelFile.readAllBytes());

    }

    @GetMapping("/conventions")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> exportConventions(
            @RequestParam(required = false) String entrepriseNom,
            @RequestParam(required = false) StatutConventionEnum statut)
            throws IOException {

        if (entrepriseNom != null && entrepriseNom.trim().isEmpty()) {
            entrepriseNom = null;
        }

        ByteArrayInputStream excelFile =
                csvService.exportConventions(
                        entrepriseNom,
                        statut
                );

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=conventions.xlsx"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .body(excelFile.readAllBytes());
    }

    @GetMapping("/soutenances")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> exportSoutenances(
            @RequestParam(required = false) String salle,
            @RequestParam(required = false) String jury)
            throws IOException {

        if (salle != null && salle.trim().isEmpty()) salle = null;
        if (jury != null && jury.trim().isEmpty()) jury = null;

        ByteArrayInputStream excelFile =
                csvService.exportPlanningSoutenances(salle, jury);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=planning_soutenances.xlsx"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .body(excelFile.readAllBytes());
    }

    @GetMapping("/notes")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> exportNotes(
            @RequestParam(required = false) Double min,
            @RequestParam(required = false) Double max)
            throws IOException {

        ByteArrayInputStream excelFile = csvService.exportNotes(min, max);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=notes_soutenances.xlsx"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .body(excelFile.readAllBytes());
    }
}
