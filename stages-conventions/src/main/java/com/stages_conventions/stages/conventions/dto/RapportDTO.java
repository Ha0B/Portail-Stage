package com.stages_conventions.stages.conventions.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.stages_conventions.stages.conventions.enums.StatutRapportEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

public class RapportDTO {

    @Data
    public static class CreateInput {

        @NotBlank(message = "Le titre est obligatoire")
        private String titre;

        private String contenu;

        @NotNull(message = "L'ID du stage est obligatoire")
        private Long idStage;
    }

    @Data
    public static class UpdateInput {

        private String titre;

        private String contenu;
    }

    @Data
    public static class Output {

        private Long id;

        private String titre;

        private String contenu;

        private String fichierNom;

        private String fichierType;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
        private LocalDateTime dateSoumission;

        private StatutRapportEnum statutRapport;

        private String commentaire;

        private Long idStage;
    }
}