package com.stages_conventions.stages.conventions.serviceImpl;

import com.stages_conventions.stages.conventions.dto.NoteDTO;
import com.stages_conventions.stages.conventions.exception.ElementNonTrouver;
import com.stages_conventions.stages.conventions.exception.ElementNull;
import com.stages_conventions.stages.conventions.mapper.NoteMapper;
import com.stages_conventions.stages.conventions.model.*;
import com.stages_conventions.stages.conventions.repository.*;
import com.stages_conventions.stages.conventions.service.NoteService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class NoteServiceImpl implements NoteService {

    private final NoteRepository noteRepository;
    private final NoteMapper noteMapper;
    private final EtudiantRepository etudiantRepository;
    private final JuryRepository juryRepository;
    private final SoutenanceRepository soutenanceRepository;
    private final RubriqueRepository rubriqueRepository;

    @Override
    public List<NoteDTO.Output> recupererNotes() {
        return noteRepository.findAll()
                .stream()
                .map(noteMapper::toOutput)
                .toList();
    }

    @Override
    public List<NoteDTO.Output> trouverNoteParEtudiant(Long idEtudiant) {
        if (idEtudiant == null) {
            throw new ElementNull("idEtudiant invalide");
        }
        if (!etudiantRepository.existsById(idEtudiant)) {
            throw new ElementNonTrouver("Etudiant introuvable");
        }
        return noteRepository.findBySoutenance_Stage_Etudiant_Id(idEtudiant)
                .stream()
                .map(noteMapper::toOutput)
                .toList();
    }

    @Override
    public List<NoteDTO.Output> trouverNotesParStage(Long stageId) {
        if (stageId == null) throw new ElementNull("L'ID du stage est invalide");
        return noteRepository.findBySoutenance_Stage_Id(stageId)
                .stream()
                .map(noteMapper::toOutput)
                .toList();
    }

    @Override
    public NoteDTO.Output ajouterNote(NoteDTO.CreateInput input) {
        if (input == null) {
            throw new ElementNull("Note invalide");
        }
        if (noteRepository.existsByJury_IdAndRubrique_IdAndSoutenance_Id(
                input.getIdJury(),
                input.getIdRubrique(),
                input.getIdSoutenance())) {
            throw new RuntimeException("Cette note existe déjà pour cette rubrique");
        }

        Jury jury = juryRepository.findById(input.getIdJury())
                .orElseThrow(() -> new ElementNonTrouver("Jury introuvable"));
        Soutenance soutenance = soutenanceRepository.findById(input.getIdSoutenance())
                .orElseThrow(() -> new ElementNonTrouver("Soutenance introuvable"));
        Rubrique rubrique = rubriqueRepository.findById(input.getIdRubrique())
                .orElseThrow(() -> new ElementNonTrouver("Rubrique introuvable"));

        Note note = noteMapper.toEntity(input);
        note.setJury(jury);
        note.setSoutenance(soutenance);
        note.setRubrique(rubrique);

        return noteMapper.toOutput(noteRepository.save(note));
    }

    @Override
    public NoteDTO.Output modifierNote(Long idNote, NoteDTO.UpdateInput input) {
        if (idNote == null || input == null) {
            throw new ElementNull("Données invalides");
        }

        Note note = noteRepository.findById(idNote)
                .orElseThrow(() -> new ElementNonTrouver("Note introuvable"));

        noteMapper.updateEntity(input, note);

        if (input.getIdRubrique() != null) {
            Rubrique rubrique = rubriqueRepository.findById(input.getIdRubrique())
                    .orElseThrow(() -> new ElementNonTrouver("Rubrique introuvable"));
            note.setRubrique(rubrique);
        }

        if (input.getIdJury() != null) {
            Jury jury = juryRepository.findById(input.getIdJury())
                    .orElseThrow(() -> new ElementNonTrouver("Jury introuvable"));
            note.setJury(jury);
        }

        if (input.getIdSoutenance() != null) {
            Soutenance soutenance = soutenanceRepository.findById(input.getIdSoutenance())
                    .orElseThrow(() -> new ElementNonTrouver("Soutenance introuvable"));
            note.setSoutenance(soutenance);
        }

        return noteMapper.toOutput(noteRepository.save(note));
    }

    @Override
    public void supprimerNote(Long id) {
        if (id == null) {
            throw new ElementNull("id invalide");
        }
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ElementNonTrouver("Note introuvable"));
        noteRepository.delete(note);
    }

    @Override
    public NoteDTO.Output recupererNote(Long id) {
        if (id == null) {
            throw new ElementNull("id invalide");
        }
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ElementNonTrouver("Note introuvable"));
        return noteMapper.toOutput(note);
    }

    @Override
    public Double calculerMoyenneEtudiant(Long idEtudiant) {
        List<Note> notes = noteRepository
                .findBySoutenance_Stage_Etudiant_Id(idEtudiant);
        return notes.stream()
                .mapToDouble(Note::getValeur)
                .average()
                .orElse(0.0);
    }
}