package com.stages_conventions.stages.conventions.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.stages_conventions.stages.conventions.enums.StatutStageEnum;
import lombok.Data;

import java.util.Date;

@Data
public class StageDTO {

    @Data
    public static class CreateInput {
        private String titre;
        private String description;
        @JsonFormat(shape = JsonFormat.Shape.STRING,pattern = "dd-MM-yyyy")
        private Date dateDebut;
        @JsonFormat(shape = JsonFormat.Shape.STRING,pattern = "dd-MM-yyyy")
        private Date dateFin;
        private Long etudiantId;
        private Long entrepriseId;
        private Long encadrantId;
    }

    @Data
    public static class UpdateInput {
        private String titre;
        private String description;
        private Date dateDebut;
        private Date dateFin;
        private Long entrepriseId;
        private Long encadrantId;
    }

    @Data
    public static class Output {
        private Long id;
        private String titre;
        private Date dateDebut;
        private Date dateFin;
        private StatutStageEnum statut;
        private Long etudiantId;
        private String nomEtudiant;
        private String prenomEtudiant;
        private String nomEntreprise;
        private String nomEncadrant;
    }

    @Data
    public static class StagiaireDTO {
        private Long stageId;
        private Long etudiantId;
        private String nom;
        private String prenom;
        private String email;
        private String entreprise;
        private StatutStageEnum statut;
        private Date dateDebut;
        private Date dateFin;
    }

}