package com.stages_conventions.stages.conventions.controller;

import com.stages_conventions.stages.conventions.dto.OffreDTO;
import com.stages_conventions.stages.conventions.service.OffreService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/offre")
@AllArgsConstructor
public class OffreController {

    private final OffreService offreService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','ETUDIANT','ENTREPRISE')")
    @ResponseStatus(HttpStatus.OK)
    public List<OffreDTO.Output> listerOffres() {
        return offreService.listerOffres();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ETUDIANT','ENTREPRISE')")
    @ResponseStatus(HttpStatus.OK)
    public OffreDTO.Output trouverOffre(@PathVariable Long id) {
        return offreService.trouverOffre(id);
    }

    @GetMapping("/entreprise/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ENTREPRISE')")
    @ResponseStatus(HttpStatus.OK)
    public List<OffreDTO.Output> listerOffreParEntreprise(@PathVariable Long id) {
        return offreService.listerOffreParEntreprise(id);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN','ETUDIANT','ENTREPRISE')")
    @ResponseStatus(HttpStatus.OK)
    public List<OffreDTO.Output> searchOffres(
            @RequestParam(required = false) String titre,
            @RequestParam(required = false) String lieu,
            @RequestParam(required = false) String competences) {
        return offreService.searchOffres(titre, lieu, competences);
    }

    @PostMapping
    @PreAuthorize("hasRole('ENTREPRISE')")
    @ResponseStatus(HttpStatus.CREATED)
    public OffreDTO.Output saveOffre(@Valid @RequestBody OffreDTO.CreateInput offreInput) {
        return offreService.ajouterOffre(offreInput);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ENTREPRISE')")
    @ResponseStatus(HttpStatus.OK)
    public OffreDTO.Output modifierOffre(
            @PathVariable Long id,
            @Valid @RequestBody OffreDTO.UpdateInput offreInput) {
        return offreService.modifierOffre(id, offreInput);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ENTREPRISE')")
    @ResponseStatus(HttpStatus.OK)
    public boolean deleteOffre(@PathVariable Long id) {
        return offreService.supprimerOffre(id);
    }
}