package com.stages_conventions.stages.conventions.dto;

import com.stages_conventions.stages.conventions.enums.RoleEnum;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

public class EtudiantDTO {

    @Data
    public static class CreateInput {

        @NotBlank(message = "Le nom est obligatoire")
        private String nom;

        @NotBlank(message = "Le prénom est obligatoire")
        private String prenom;

        @NotBlank(message = "L'email est obligatoire")
        @Email(message = "Format email invalide")
        private String email;

        @NotBlank(message = "Le mot de passe est obligatoire")
        private String motDePasse;

        @NotBlank(message = "Le numéro étudiant est obligatoire")
        private String numeroEtudiant;

        private String filiere;
        private String niveau;
        private String promotion;
        private String cv;
        private String lettreMotivation;
    }

    @Data
    public static class UpdateInput {

        @NotBlank(message = "Le nom est obligatoire")
        private String nom;

        @NotBlank(message = "Le prénom est obligatoire")
        private String prenom;

        @NotBlank(message = "L'email est obligatoire")
        @Email(message = "Format email invalide")
        private String email;

        private String motDePasse;

        @NotBlank(message = "Le numéro étudiant est obligatoire")
        private String numeroEtudiant;

        private String filiere;
        private String niveau;
        private String promotion;
        private String cv;
        private String lettreMotivation;

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

        private String numeroEtudiant;
        private String filiere;
        private String niveau;
        private String promotion;
        private String cv;
        private String lettreMotivation;

        private List<Long> idCandidatures;
        private List<Long> idStages;
    }
}