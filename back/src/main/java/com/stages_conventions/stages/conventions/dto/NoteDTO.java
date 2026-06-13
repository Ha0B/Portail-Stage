package com.stages_conventions.stages.conventions.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

public class NoteDTO {

    @Data
    public static class CreateInput {

        @NotNull(message = "La valeur de la note est obligatoire")
        @DecimalMin(value = "0.0", message = "La note doit être supérieure ou égale à 0")
        @DecimalMax(value = "20.0", message = "La note doit être inférieure ou égale à 20")
        private Double valeur;

        private String appreciation;

        private Long idRubrique;

        private Long idJury;

        private Long idSoutenance;
    }

    @Data
    public static class UpdateInput {

        @DecimalMin(value = "0.0", message = "La note doit être supérieure ou égale à 0")
        @DecimalMax(value = "20.0", message = "La note doit être inférieure ou égale à 20")
        private Double valeur;

        private String appreciation;

        private Long idRubrique;

        private Long idJury;

        private Long idSoutenance;
    }

    @Data
    public static class Output {

        private Long id;

        private Double valeur;

        private String appreciation;

        @JsonFormat(shape = JsonFormat.Shape.STRING,
                pattern = "dd-MM-yyyy HH:mm:ss")
        private LocalDateTime dateAttribution;

        private Long idRubrique;
        private String rubriqueNom;

        private Long idJury;

        private Long idSoutenance;
    }
}
