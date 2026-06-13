package com.stages_conventions.stages.conventions.dto;

import com.stages_conventions.stages.conventions.enums.RoleEnum;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

public class EncadrantDTO {

    @Data
    public static class CreateInput {
        @NotBlank(message = "Le nom est obligatoire")
        private String nom;

        @NotBlank(message = "Le prénom est obligatoire")
        private String prenom;

        @NotBlank(message = "L'email est obligatoire")
        @Email(message = "Format d'email invalide")
        private String email;

        @NotBlank(message = "Le mot de passe est obligatoire")
        private String motDePasse;

        private String poste;
        private String departement;
        private String telephone;
    }

    @Data
    public static class UpdateInput {
        @NotBlank(message = "Le nom est obligatoire")
        private String nom;

        @NotBlank(message = "Le prénom est obligatoire")
        private String prenom;

        @NotBlank(message = "L'email est obligatoire")
        @Email(message = "Format d'email invalide")
        private String email;

        private String motDePasse;

        private String poste;
        private String departement;
        private String telephone;

        @NotNull
        private boolean actif;
    }

    @Data
    public static class Output {
        private Long id;
        private String nom;
        private String prenom;
        private String email;
        private RoleEnum role;
        private LocalDate dateCreation;
        private boolean actif;
        private String poste;
        private String departement;
        private String telephone;
    }
}