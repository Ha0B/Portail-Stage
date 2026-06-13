package com.stages_conventions.stages.conventions.dto;

import com.stages_conventions.stages.conventions.enums.TypeRubriqueEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class RubriqueDTO {

    @Data
    public static class CreateInput {
        @NotBlank(message = "L'intitulé est obligatoire")
        private String intitule ;

        private String description ;

        @Positive(message = "Le coefficient doit être positif")
        private double coefficient ;

        @Positive(message = "La note maximale doit être positive")
        private double noteMax ;

        @NotNull(message = "Le type de rubrique est obligatoire")
        private TypeRubriqueEnum typeRubrique ;

    }

    @Data
    public static class UpdateInput {
        private String intitule;
        private String description;
        @Positive(message = "Le coefficient doit être positif")
        private Double coefficient;
        @Positive(message = "La note maximale doit être positive")
        private Double noteMax;
        private TypeRubriqueEnum typeRubrique;
    }

    @Data
    public static class Output {
        private Long id;
        private String intitule;
        private String description;
        private double coefficient;
        private double noteMax;
        private TypeRubriqueEnum typeRubrique;
    }
}