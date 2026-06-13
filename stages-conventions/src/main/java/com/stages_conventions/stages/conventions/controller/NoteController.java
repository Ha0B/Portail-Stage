package com.stages_conventions.stages.conventions.controller;

import com.stages_conventions.stages.conventions.dto.NoteDTO;
import com.stages_conventions.stages.conventions.service.NoteService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/notes")
public class NoteController {

    private final NoteService noteService;

    @GetMapping
    @PreAuthorize("hasAnyRole('JURY','ADMIN')")
    public List<NoteDTO.Output> listeNotes() {
        return noteService.recupererNotes();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('JURY','ADMIN')")
    public NoteDTO.Output getNote(@PathVariable Long id) {
        return noteService.recupererNote(id);
    }

    @GetMapping("/etudiant/{idEtudiant}")
    @PreAuthorize("hasAnyRole('ETUDIANT','JURY','ADMIN')")
    public List<NoteDTO.Output> notesEtudiant(@PathVariable Long idEtudiant) {
        return noteService.trouverNoteParEtudiant(idEtudiant);
    }

    @GetMapping("/stage/{idStage}")
    @PreAuthorize("hasAnyRole('JURY','ADMIN','ENCADRANT')")
    public List<NoteDTO.Output> notesParStage(@PathVariable Long idStage) {
        return noteService.trouverNotesParStage(idStage);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('JURY','ADMIN','ENCADRANT','ENTREPRISE')")
    @ResponseStatus(HttpStatus.CREATED)
    public NoteDTO.Output ajouter(@RequestBody NoteDTO.CreateInput input) {
        return noteService.ajouterNote(input);
    }

    @PutMapping("/{idNote}")
    @PreAuthorize("hasAnyRole('JURY','ADMIN','ENCADRANT','ENTREPRISE')")
    public NoteDTO.Output modifier(
            @PathVariable Long idNote,
            @RequestBody NoteDTO.UpdateInput input) {

        return noteService.modifierNote(idNote, input);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('JURY','ADMIN','ENCADRANT','ENTREPRISE')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void supprimer(@PathVariable Long id) {
        noteService.supprimerNote(id);
    }

    @GetMapping("/{idEtudiant}/moyenne")
    @PreAuthorize("hasAnyRole('JURY','ADMIN','ETUDIANT')")
    public Double moyenne(@PathVariable Long idEtudiant) {
        return noteService.calculerMoyenneEtudiant(idEtudiant);
    }
}