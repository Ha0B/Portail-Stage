package com.stages_conventions.stages.conventions.controller;

import com.stages_conventions.stages.conventions.dto.ObjectifDTO;
import com.stages_conventions.stages.conventions.enums.StatutObjectifEnum;
import com.stages_conventions.stages.conventions.service.ObjectifService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/objectifs")
@AllArgsConstructor
public class ObjectifController {

    private final ObjectifService objectifService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','ETUDIANT','ENCADRANT')")
    @ResponseStatus(HttpStatus.OK)
    public List<ObjectifDTO.Output> listerObjectifs() {
        return objectifService.listerObjectifs();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ETUDIANT','ENCADRANT')")
    @ResponseStatus(HttpStatus.OK)
    public ObjectifDTO.Output recupererObjectif(@PathVariable Long id) {
        return objectifService.recupererObjectif(id);
    }

    @GetMapping("/stage/{stageId}")
    @PreAuthorize("hasAnyRole('ADMIN','ETUDIANT','ENCADRANT')")
    @ResponseStatus(HttpStatus.OK)
    public List<ObjectifDTO.Output> listerObjectifsParStage(
            @PathVariable Long stageId) {

        return objectifService.listerObjectifsParStage(stageId);
    }

    @PostMapping
    @PreAuthorize("hasRole('ENTREPRISE')")
    @ResponseStatus(HttpStatus.CREATED)
    public ObjectifDTO.Output ajouterObjectif(
            @Valid @RequestBody ObjectifDTO.CreateInput dto) {

        return objectifService.ajouterObjectif(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ENTREPRISE')")
    @ResponseStatus(HttpStatus.OK)
    public ObjectifDTO.Output modifierObjectif(
            @PathVariable Long id,
            @Valid @RequestBody ObjectifDTO.UpdateInput dto) {

        return objectifService.modifierObjectif(id, dto);

    }

    @PutMapping("/{id}/valider")
    @PreAuthorize("hasRole('ENTREPRISE')")
    public ObjectifDTO.Output valider(@PathVariable Long id) {
        return objectifService.changerStatut(id, StatutObjectifEnum.VALIDE);
    }

    @PutMapping("/{id}/rejeter")
    @PreAuthorize("hasRole('ENTREPRISE')")
    public ObjectifDTO.Output rejeter(@PathVariable Long id) {
        return objectifService.changerStatut(id, StatutObjectifEnum.REJETE);
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ENTREPRISE')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void supprimerObjectif(@PathVariable Long id) {
        objectifService.supprimerObjectif(id);
    }
}