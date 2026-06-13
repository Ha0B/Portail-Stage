package com.stages_conventions.stages.conventions.service;

import com.stages_conventions.stages.conventions.dto.NoteDTO;
import java.util.List;

public interface NoteService {

    List<NoteDTO.Output> recupererNotes();

    List<NoteDTO.Output> trouverNoteParEtudiant(Long idEtudiant);

    List<NoteDTO.Output> trouverNotesParStage(Long stageId);

    NoteDTO.Output ajouterNote(NoteDTO.CreateInput input);

    NoteDTO.Output modifierNote(Long idNote, NoteDTO.UpdateInput input);

    void supprimerNote(Long id);

    NoteDTO.Output recupererNote(Long id);

    Double calculerMoyenneEtudiant(Long idEtudiant);
}