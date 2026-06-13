package com.stages_conventions.stages.conventions.repository;

import com.stages_conventions.stages.conventions.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note,Long> {

    List<Note> findBySoutenance_Stage_Etudiant_Id(Long idEtudiant);

    boolean existsByJury_IdAndRubrique_IdAndSoutenance_Id(Long idJury, Long idRubrique, Long idSoutenance);

    List<Note> findBySoutenance_Stage_Id(Long stageId);
}
