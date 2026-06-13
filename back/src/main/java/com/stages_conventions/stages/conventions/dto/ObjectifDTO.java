package com.stages_conventions.stages.conventions.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.stages_conventions.stages.conventions.enums.PrioriteEnum;
import com.stages_conventions.stages.conventions.enums.StatutObjectifEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ObjectifDTO {

    @Data
    public static class CreateInput {
        @NotBlank(message = "La description est obligatoire")
        private String description;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
        private LocalDate dateEcheance;

        private StatutObjectifEnum statut;
        private PrioriteEnum priorite;

        @NotNull(message = "L'ID du stage est obligatoire")
        private Long idStage;
    }

    @Data
    public static class UpdateInput {
        private String description;
        private StatutObjectifEnum statut;
        private PrioriteEnum priorite;
    }

    @Data
    public static class Output {
        private Long id;
        private String description;
        private StatutObjectifEnum statut;
        private LocalDate dateEcheance;
        private PrioriteEnum priorite;
        private Long idStage;
    }
}