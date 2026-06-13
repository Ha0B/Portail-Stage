package com.stages_conventions.stages.conventions.controller;

import com.stages_conventions.stages.conventions.dto.EncadrantDTO;
import com.stages_conventions.stages.conventions.service.EncadrantService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/encadrant")
@AllArgsConstructor
public class EncadrantController {

    private final EncadrantService encadrantService;

    @GetMapping("/lister")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public List<EncadrantDTO.Output> listerEncadrants() {

        return encadrantService.listerEncadrants();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ENCADRANT')")
    @ResponseStatus(HttpStatus.OK)
    public EncadrantDTO.Output chercherEncadrantId(
            @PathVariable Long id) {

        return encadrantService.chercherEncadrantId(id);
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ENCADRANT')")
    @ResponseStatus(HttpStatus.OK)
    public EncadrantDTO.Output chercherEncadrantEmail(
            @PathVariable String email) {

        return encadrantService.chercherEncadrantEmail(email);
    }

    @PostMapping("/ajouter")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public EncadrantDTO.Output ajouterEncadrant(
            @RequestBody @Valid EncadrantDTO.CreateInput dto) {

        return encadrantService.ajouterEncadrant(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ENCADRANT')")
    @ResponseStatus(HttpStatus.OK)
    public EncadrantDTO.Output modifierEncadrant(
            @PathVariable Long id,
            @RequestBody @Valid EncadrantDTO.UpdateInput dto) {

        return encadrantService.modifierEncadrant(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public EncadrantDTO.Output supprimerEncadrant(
            @PathVariable Long id) {

        return encadrantService.supprimerEncadrant(id);
    }
}