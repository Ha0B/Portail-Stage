package com.stages_conventions.stages.conventions.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.stages_conventions.stages.conventions.enums.StatutOffreEnum;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;

public class OffreDTO {

    @Data
    public static class CreateInput {
        @NotBlank(message = "Le titre est obligatoire")
        private String titre;

        @NotBlank(message = "La description est obligatoire")
        private String description;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
        private Date dateExpiration;

        @Min(value = 1, message = "La durée doit être d'au moins 1 mois/semaine")
        private int duree;

        private double remuneration;

        @NotBlank(message = "Le lieu est obligatoire")
        private String lieu;

        private String competencesRequises;

        @NotNull(message = "L'ID de l'entreprise est obligatoire")
        private Long entrepriseId;
    }

    @Data
    public static class UpdateInput {
        private String titre;
        private String description;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
        private Date dateExpiration;

        private int duree;
        private double remuneration;
        private String lieu;
        private String competencesRequises;
        private StatutOffreEnum statut;
    }

    @Data
    public static class Output {
        private Long id;
        private String titre;
        private String description;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
        private Date datePublication;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
        private Date dateExpiration;

        private int duree;
        private double remuneration;
        private String lieu;
        private String competencesRequises;
        private StatutOffreEnum statut;

        // Informations de l'entreprise rattache
        private Long entrepriseId;
        private String entrepriseNom;
        private String entrepriseEmail;

        // Calculer dynamiquement
        private int nombreCandidatures;
    }
}