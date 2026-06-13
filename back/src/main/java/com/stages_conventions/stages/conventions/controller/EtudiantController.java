package com.stages_conventions.stages.conventions.controller;

import com.stages_conventions.stages.conventions.dto.EtudiantDTO;
import com.stages_conventions.stages.conventions.service.EtudiantService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/etudiant")
public class EtudiantController {

    private EtudiantService etudiantServ;

    @GetMapping("/lister")
    @PreAuthorize("hasRole('ADMIN')")
    public List<EtudiantDTO.Output> listeEtudiants() {

        return etudiantServ.listeEtudiant();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ETUDIANT')")
    public EtudiantDTO.Output chercherEtudiant(
            @PathVariable Long id) {

        return etudiantServ.chercherEtudId(id);
    }

    @PostMapping("/ajouter")
    @PreAuthorize("hasRole('ADMIN')")
    public EtudiantDTO.Output ajouterEtudiant(
            @Valid @RequestBody EtudiantDTO.CreateInput dto) {

        return etudiantServ.ajouterEtudiant(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ETUDIANT')")
    public EtudiantDTO.Output modifierEtudiant(
            @PathVariable Long id,
            @Valid @RequestBody EtudiantDTO.UpdateInput dto) {

        return etudiantServ.modifierEtudiant(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public boolean supprimerEtudiant(
            @PathVariable Long id) {

        return etudiantServ.supprimerEtudiant(id);
    }
}