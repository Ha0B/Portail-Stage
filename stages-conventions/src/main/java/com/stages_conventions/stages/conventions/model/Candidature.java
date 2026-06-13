package com.stages_conventions.stages.conventions.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.stages_conventions.stages.conventions.enums.StatutCandidatureEnum;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

    @Entity
    @Data
    public class Candidature {
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        @JsonFormat(shape = JsonFormat.Shape.STRING , pattern = "dd-MM-yyyy")
        private LocalDate dateCandidature;

        @Enumerated(EnumType.STRING)
        private StatutCandidatureEnum statut;
        private String lettreMotivation;
        private String cvNom;
        private String cvType;
        @Lob
        private byte[] cvData ;

        @ManyToOne @JoinColumn(name = "etudiant_id")
        private Etudiant etudiant;

        @ManyToOne @JoinColumn(name = "offre_id")
        private Offre offre;

        public void setDateCandidature() {
            this.dateCandidature = LocalDate.now();
        }
    }