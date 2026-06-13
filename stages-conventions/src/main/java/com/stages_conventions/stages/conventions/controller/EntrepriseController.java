package com.stages_conventions.stages.conventions.controller;

import com.stages_conventions.stages.conventions.dto.EntrepriseDTO;
import com.stages_conventions.stages.conventions.service.EntrepriseService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/entreprise")
public class EntrepriseController {

    private final EntrepriseService entrepriseServ;

    @GetMapping("/lister")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public List<EntrepriseDTO.Output> listEntreprises() {

        return entrepriseServ.listerEntreprise();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ENTREPRISE')")
    @ResponseStatus(HttpStatus.OK)
    public EntrepriseDTO.Output trouverEntreprise(
            @PathVariable Long id) {

        return entrepriseServ.chercherEntrepriseId(id);
    }

    @PostMapping("/ajouter")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public EntrepriseDTO.Output ajouterEntreprise(
            @Valid @RequestBody EntrepriseDTO.CreateInput dto) {

        return entrepriseServ.ajouterEntreprise(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ENTREPRISE')")
    @ResponseStatus(HttpStatus.OK)
    public EntrepriseDTO.Output modifierEntreprise(
            @PathVariable Long id,
            @Valid @RequestBody EntrepriseDTO.UpdateInput dto) {

        return entrepriseServ.modifierEntreprise(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public boolean supprimerEntreprise(
            @PathVariable Long id) {

        return entrepriseServ.supprimerEntreprise(id);
    }
}
