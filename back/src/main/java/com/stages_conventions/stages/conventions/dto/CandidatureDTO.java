package com.stages_conventions.stages.conventions.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.stages_conventions.stages.conventions.enums.StatutCandidatureEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

public class CandidatureDTO {

    @Data
    public static class CreateInput {

        @NotBlank(message = "La lettre de motivation est obligatoire")
        private String lettreMotivation;

        @NotNull(message = "L'ID de l'étudiant est obligatoire")
        private Long idEtudiant;

        @NotNull(message = "L'ID de l'offre est obligatoire")
        private Long idOffre;
    }

    @Data
    public static class UpdateInput {

        private String lettreMotivation;
    }

    @Data
    public static class Output {

        private Long id;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
        private LocalDate dateCandidature;

        private StatutCandidatureEnum statut;

        private String lettreMotivation;

        private String cvNom;

        private String cvType;

        private Long idEtudiant;

        private Long idOffre;
    }
}