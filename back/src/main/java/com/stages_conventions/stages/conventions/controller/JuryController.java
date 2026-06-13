package com.stages_conventions.stages.conventions.controller;

import com.stages_conventions.stages.conventions.dto.JuryDTO;
import com.stages_conventions.stages.conventions.service.JuryService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jury")
@AllArgsConstructor
public class JuryController {

    private JuryService juryService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','ENCADRANT')")
    @ResponseStatus(HttpStatus.OK)
    public List<JuryDTO.Output> listeJury() {
        return juryService.listeJury();
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN','ENCADRANT','ETUDIANT')")
    @ResponseStatus(HttpStatus.OK)
    public JuryDTO.Output chercherJury(@RequestParam String nomJury) {
        return juryService.trouverJury(nomJury);
    }

    @GetMapping("/{idEncadrant}")
    @PreAuthorize("hasAnyRole('ENCADRANT')")
    @ResponseStatus(HttpStatus.OK)
    public List<JuryDTO.Output> trouverJuryParEncadrant(@PathVariable @Valid Long idEncadrant) {
        return juryService.getJuryByEncadantId(idEncadrant);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> affecterJury(@RequestBody JuryDTO.CreateInput dto) {
        juryService.affecterJury(dto);
        return ResponseEntity.ok("Jury affecté avec succès");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<String> modifierJury(
            @PathVariable Long id,
            @RequestBody JuryDTO.UpdateInput dto) {
        juryService.modifierJury(id, dto);
        return ResponseEntity.ok("Jury modifié avec succès");
    }

    @DeleteMapping("/{encadrantId}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<String> retirerJury(@PathVariable Long encadrantId) {
        juryService.retirerJury(encadrantId);
        return ResponseEntity.ok("Jury retiré avec succès");
    }

    @GetMapping("/soutenance/{soutenanceId}")
    @PreAuthorize("hasAnyRole('ADMIN','ENCADRANT','ETUDIANT')")
    public List<JuryDTO.Output> getJuryBySoutenance(@PathVariable Long soutenanceId) {
        return juryService.getJuryBySoutenanceId(soutenanceId);
    }
}