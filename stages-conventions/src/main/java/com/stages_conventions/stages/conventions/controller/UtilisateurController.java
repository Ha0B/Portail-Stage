package com.stages_conventions.stages.conventions.controller;

import com.stages_conventions.stages.conventions.model.Utilisateur;
import com.stages_conventions.stages.conventions.service.UtilisateurService;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/utilisateur")
public class UtilisateurController {

    private UtilisateurService utilisateurService;

    @GetMapping("/lister")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Utilisateur> getUtilisateurs() {

        return utilisateurService
                .listerUtilisateurs();
    }

    @GetMapping("/lister/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ETUDIANT','ENTREPRISE','ENCADRANT')")
    public Utilisateur chercherUtilisateur(
            @PathVariable Long id) {

        return utilisateurService
                .chercherUtilId(id);
    }

    @PostMapping("/ajouter")
    @PreAuthorize("hasRole('ADMIN')")
    public boolean ajouterUtilisateur(
            @RequestBody Utilisateur utilisateur) {

        return utilisateurService
                .ajouterUtilisateur(utilisateur) != null;
    }

    @PutMapping("/modifier/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ETUDIANT','ENTREPRISE','ENCADRANT')")
    public boolean modifierUtilisateur(
            @PathVariable Long id,
            @RequestBody Utilisateur utilisateur) {

        return utilisateurService
                .modifierUtilisateur(id, utilisateur) != null;
    }

    @DeleteMapping("/supprimer/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public boolean supprimerUtilisateur(
            @PathVariable Long id) {

        return utilisateurService
                .supprimerUtilisateur(id);
    }
}