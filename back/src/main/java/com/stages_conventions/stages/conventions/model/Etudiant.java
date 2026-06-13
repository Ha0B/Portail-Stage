package com.stages_conventions.stages.conventions.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.List;

@Entity
@Table(name = "etudiant")
@PrimaryKeyJoinColumn(name = "id_utilisateur")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Etudiant extends Utilisateur {
    private String numeroEtudiant;
    private String filiere;
    private String niveau;
    private String promotion;
    private String cv ;

    @OneToMany(mappedBy = "etudiant")
    private List<Candidature> candidatures;

    @OneToMany(mappedBy = "etudiant")
    private List<Stage> stages;
}