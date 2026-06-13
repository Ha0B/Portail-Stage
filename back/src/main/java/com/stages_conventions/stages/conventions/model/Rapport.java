package com.stages_conventions.stages.conventions.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.stages_conventions.stages.conventions.enums.StatutRapportEnum;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
@Entity
@Data
public class Rapport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    private String contenu;

    private String fichierNom;

    private String fichierType;

    @Lob
    private byte[] fichierData;

    @JsonFormat(shape = JsonFormat.Shape.STRING , pattern = "dd-MM-yyyy")
    private LocalDateTime dateSoumission;

    @Enumerated(EnumType.STRING)
    private StatutRapportEnum statutRapport;

    private String commentaire;

    @OneToOne
    @JoinColumn(name = "stage_id")
    private Stage stage;
}