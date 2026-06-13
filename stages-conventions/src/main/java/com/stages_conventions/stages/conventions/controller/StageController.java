package com.stages_conventions.stages.conventions.controller;

import com.stages_conventions.stages.conventions.dto.EtudiantDTO;
import com.stages_conventions.stages.conventions.dto.StageDTO;
import com.stages_conventions.stages.conventions.service.StageService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stage")
@AllArgsConstructor
public class StageController {

    private final StageService stageService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','ENCADRANT')")
    public List<StageDTO.Output> listerStages() {
        return stageService.listerStages();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ETUDIANT','ENCADRANT','ENTREPRISE')")
    public StageDTO.Output recupererStage(@PathVariable Long id) {
        return stageService.recupererStage(id);
    }

    @GetMapping("/etudiant/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ETUDIANT','ENCADRANT')")
    public List<StageDTO.Output> recupererMesStages(@PathVariable Long id) {
        return stageService.recupererStagesEtudiant(id);
    }

    @GetMapping("/entreprise/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ENTREPRISE')")
    @ResponseStatus(HttpStatus.OK)
    public List<StageDTO.StagiaireDTO> recupererStagiaires( @PathVariable Long id) {
        return stageService.recupererStagesEntreprise(id);
    }

    @GetMapping("/encadrant/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ENCADRANT')")
    @ResponseStatus(HttpStatus.OK)
    public List<EtudiantDTO.Output> recupererEtudiantsEncadres( @PathVariable Long id) {
        return stageService.recupererEtudiantsEncadres(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','ENTREPRISE')")
    @ResponseStatus(HttpStatus.CREATED)
    public StageDTO.Output ajouterStage(@Valid @RequestBody StageDTO.CreateInput input) {
        return stageService.ajouterStage(input);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ENTREPRISE')")
    public StageDTO.Output modifierStage(
            @PathVariable Long id,
            @Valid @RequestBody StageDTO.UpdateInput input) {
        return stageService.modifierStage(id, input);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public boolean supprimerStage(@PathVariable Long id) {
        return stageService.supprimerStage(id);
    }

    @PutMapping("/{id}/statut")
    @PreAuthorize("hasAnyRole('ADMIN','ENCADRANT','ENTREPRISE')")
    public StageDTO.Output changerStatut( @PathVariable Long id, @RequestBody String statut) {

        return stageService.modifierStatutStage(id, statut);
    }

    @GetMapping("/{id}/verifier-dates")
    @PreAuthorize("hasAnyRole('ADMIN','ENCADRANT')")
    public boolean verifierDates(@PathVariable Long id) {
        return stageService.verifierDatesStage(id);
    }
}