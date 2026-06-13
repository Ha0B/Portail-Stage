package com.stages_conventions.stages.conventions.controller;

import com.stages_conventions.stages.conventions.dto.RubriqueDTO;
import com.stages_conventions.stages.conventions.service.RubriqueService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rubrique")
@RequiredArgsConstructor
public class RubriqueController {

    private final RubriqueService rubriqueService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','ENCADRENT')")
    @ResponseStatus(HttpStatus.OK)
    public List<RubriqueDTO.Output> listerRubriques() {
        return rubriqueService.listerRubriques();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ENCADRENT')")
    @ResponseStatus(HttpStatus.OK)
    public RubriqueDTO.Output recupererRubrique(@PathVariable @Valid Long id) {
        return rubriqueService.recupererRubrique(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public RubriqueDTO.Output ajouterRubrique(@Valid @RequestBody RubriqueDTO.CreateInput dto) {
        return rubriqueService.ajouterRubrique(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public RubriqueDTO.Output modifierRubrique(@Valid @PathVariable Long id,
                                               @Valid @RequestBody RubriqueDTO.UpdateInput dto) {
        return rubriqueService.modifierRubrique(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void supprimerRubrique(@Valid @PathVariable Long id) {
        rubriqueService.supprimerRubrique(id);
    }
}