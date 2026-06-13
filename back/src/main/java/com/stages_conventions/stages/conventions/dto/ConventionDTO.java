package com.stages_conventions.stages.conventions.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.stages_conventions.stages.conventions.enums.StatutConventionEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

public class ConventionDTO {

    @Data
    public static class CreateInput {
        @NotNull(message = "La date de début est obligatoire")
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
        private LocalDate dateDebut;

        @NotNull(message = "La date de fin est obligatoire")
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
        private LocalDate dateFin;

        @NotBlank(message = "Le sujet du stage est obligatoire")
        private String sujetStage;

        @NotNull(message = "L'ID du stage est obligatoire")
        private Long stageId;
    }

    @Data
    public static class UpdateInput {
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
        private LocalDate dateDebut;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
        private LocalDate dateFin;

        private String sujetStage;

        private StatutConventionEnum statut;

        @NotNull(message = "L'ID du stage est obligatoire")
        private Long stageId;
    }

    @Data
    public static class Output {
        private Long id;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
        private LocalDate dateDebut;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
        private LocalDate dateFin;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
        private LocalDate dateCreation;
        private String sujetStage;
        private StatutConventionEnum statut;
        private Long stageId;
    }
}