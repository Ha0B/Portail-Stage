package com.stages_conventions.stages.conventions.repository;

import com.stages_conventions.stages.conventions.model.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {

    Etudiant findByNumeroEtudiant(String numeroEtudiant);

    Etudiant findByEmail(String emailUtilisateur);

}