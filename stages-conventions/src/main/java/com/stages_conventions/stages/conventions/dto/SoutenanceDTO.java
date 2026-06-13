package com.stages_conventions.stages.conventions.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.stages_conventions.stages.conventions.enums.StatutSoutenanceEnum;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

public class SoutenanceDTO {

    @Data
    public static class CreateInput {
        @NotNull(message = "La date est obligatoire")
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
        private LocalDate date;

        @NotNull(message = "L'heure est obligatoire")
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
        private LocalTime heure;

        @NotBlank(message = "La salle est obligatoire")
        private String salle;

        @Min(value = 15, message = "La durée doit être d'au moins 15 minutes")
        private int duree;

        @NotNull(message = "L'ID du stage est obligatoire")
        private Long idStage;
    }

    @Data
    public static class UpdateInput {
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
        private LocalDate date;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
        private LocalTime heure;

        private String salle;
        private int duree;
        private StatutSoutenanceEnum statut;
        private Long idStage;
    }

    @Data
    public static class Output {
        private Long id;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
        private LocalDate date;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
        private LocalTime heure;

        private String salle;
        private int duree;
        private StatutSoutenanceEnum statut;
        private Long idStage;
    }
}