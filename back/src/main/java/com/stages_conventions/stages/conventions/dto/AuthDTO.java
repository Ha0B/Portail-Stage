package com.stages_conventions.stages.conventions.dto;

import com.stages_conventions.stages.conventions.enums.RoleEnum;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AuthDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank(message = "L'email est obligatoire")
        @Email(message = "Format d'email invalide")
        private String email;

        @NotBlank(message = "Le mot de passe est obligatoire")
        private String motDePasse;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        // --- CHAMPS COMMUNS ---
        private String nom;
        private String prenom;
        private String email;
        private String motDePasse;
        private RoleEnum role;

        // ---  ETUDIANT ---
        private String numeroEtudiant;
        private String filiere;
        private String niveau;
        private String promotion;

        // ---  ENTREPRISE ---
        private String nomEntreprise;
        private String secteurActivite;
        private String adresse;
        private String ville;
        private String telephoneEntreprise;

        // ---  ENCADRANT ---
        private String poste;
        private String departement;
        private String telephoneEncadrant;

        // ---  ADMIN ---
        private Integer niveauAcces;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginResponse {

        private String token;
        private String message;
        private RoleEnum role;

        private Long id;

        private String prenom;
        private String nom;
        private String email;

        private Long entrepriseId;
        private Long etudiantId;
        private Long encadrantId;
        private Long adminId;
    }
}