package com.stages_conventions.stages.conventions.controller;

import com.stages_conventions.stages.conventions.dto.SoutenanceDTO;
import com.stages_conventions.stages.conventions.service.SoutenanceService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/soutenance")
public class SoutenanceController {

    private final SoutenanceService soutenanceService;

    // LISTE
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasaNYRole('ENCADRANT','ADMIN','ETUDIANT')")
    public List<SoutenanceDTO.Output> listeSoutenances() {
        return soutenanceService.listeSoutenance();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('ENCADRANT','ADMIN','ETUDIANT')")
    public SoutenanceDTO.Output trouverSoutenance(@PathVariable Long id) {
        return soutenanceService.trouverSoutenance(id);
    }

    // RECHERCHE Soutenance PAR Etudiant
    @GetMapping("/etudiant/{idEtudiant}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ETUDIANT')")
    public SoutenanceDTO.Output recupererSoutenanceParEtudiant(
            @PathVariable Long idEtudiant) {

        return soutenanceService.recupererSoutenanceParEtudiant(idEtudiant);
    }

    // RECHERCHE Soutenances ou l'encadrant est JURY
    @GetMapping("/jury/{idEncadrant}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('ENCADRANT','ADMIN')")
    public List<SoutenanceDTO.Output> recupererSoutenancesParJuryEncadrant(@PathVariable Long idEncadrant) {
        return soutenanceService.recupererSoutenancesParJuryEncadrant(idEncadrant);
    }

    // AJOUT
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public SoutenanceDTO.Output ajouterSoutenance(@Valid @RequestBody SoutenanceDTO.CreateInput soutenanceInput) {
        return soutenanceService.creerSoutenance(soutenanceInput);
    }

    // MODIFICATION
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public SoutenanceDTO.Output modifierSoutenance(
            @PathVariable Long id,
            @Valid @RequestBody SoutenanceDTO.UpdateInput soutenanceInput  ) {
        return soutenanceService.modifierSoutenance(id, soutenanceInput);
    }

    // SUPPRESSION
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public boolean supprimerSoutenance(@PathVariable Long id) {
        return soutenanceService.supprimerSoutenance(id);
    }

    // RECHERCHE PAR SALLE
    @GetMapping("/salle/{salle}")
    @ResponseStatus(HttpStatus.OK)
    public List<SoutenanceDTO.Output> trouverParSalle(@PathVariable String salle) {
        return soutenanceService.trouverParSalle(salle);
    }

    // RECHERCHE PAR DATE
    @GetMapping("/date/{date}")
    @ResponseStatus(HttpStatus.OK)
    public List<SoutenanceDTO.Output> trouverParDate(@PathVariable LocalDate date) {
        return soutenanceService.trouverParDate(date);
    }

    // PLANNING
    @GetMapping("/planning")
    @ResponseStatus(HttpStatus.OK)
    public List<SoutenanceDTO.Output> planning() {
        return soutenanceService.planning();
    }
}