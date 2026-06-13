package com.stages_conventions.stages.conventions.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.stages_conventions.stages.conventions.enums.StatutStageEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Stage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    @Column(length = 1000)
    private String description;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate dateDebut;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate dateFin;

    @Enumerated(EnumType.STRING)
    private StatutStageEnum statut;

    @ManyToOne
    @JoinColumn(name = "etudiant_id")
    private Etudiant etudiant;

    @ManyToOne(optional = true)
    @JoinColumn(name = "encadrant_id")
    private Encadrant encadrant;

    @ManyToOne
    @JoinColumn(name = "entreprise_id")
    private Entreprise entreprise;

    @OneToOne(mappedBy = "stage")
    private Rapport rapport;

    @OneToMany(mappedBy = "stage")
    private List<Objectif> objectifs;

    @OneToOne(mappedBy = "stage")
    private Soutenance soutenance;

    @OneToOne(mappedBy = "stage")
    private Convention convention;
}