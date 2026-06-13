package com.stages_conventions.stages.conventions.repository;

import com.stages_conventions.stages.conventions.model.Entreprise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntrepriseRepository extends JpaRepository<Entreprise, Integer> {

    Entreprise findById(Long id) ;

    Entreprise findByEmail(String emailEntreprise);

    Entreprise findByNomEntreprise(String nomEntreprise);
}
