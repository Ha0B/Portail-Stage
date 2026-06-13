package com.stages_conventions.stages.conventions.serviceImpl;

import com.stages_conventions.stages.conventions.dto.AuthDTO;
import com.stages_conventions.stages.conventions.model.*;
import com.stages_conventions.stages.conventions.exception.ElementDejaExistant;
import com.stages_conventions.stages.conventions.exception.ElementNull;
import com.stages_conventions.stages.conventions.repository.UtilisateurRepository;
import com.stages_conventions.stages.conventions.security.JwtService;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final UtilisateurRepository utilisateurRepository;
    private final JwtService jwtService;

    public AuthDTO.LoginResponse login(AuthDTO.LoginRequest dto) {

        if (dto == null)
            throw new ElementNull("Données de connexion nulles");

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        dto.getEmail(),
                        dto.getMotDePasse()
                )
        );

        Utilisateur utilisateur =
                utilisateurRepository
                        .findByEmail(dto.getEmail())
                        .orElseThrow();

        String token =
                jwtService.generateToken(dto.getEmail());

        Long entrepriseId = null;
        Long etudiantId = null;
        Long encadrantId = null;
        Long adminId = null;

        if (utilisateur instanceof Entreprise entreprise) {

            entrepriseId = entreprise.getId();

        } else if (utilisateur instanceof Etudiant etudiant) {

            etudiantId = etudiant.getId();

        } else if (utilisateur instanceof Encadrant encadrant) {

            encadrantId = encadrant.getId();

        } else if (utilisateur instanceof Admin admin) {

            adminId = admin.getId();
        }

        return new AuthDTO.LoginResponse(
                token,
                "Authentification bien faite",
                utilisateur.getRole(),
                utilisateur.getId(),
                utilisateur.getPrenom(),
                utilisateur.getNom(),
                utilisateur.getEmail(),
                entrepriseId,
                etudiantId,
                encadrantId,
                adminId
        );
    }

    @Transactional
    public void register(AuthDTO.RegisterRequest dto) {
        if (dto == null) throw new ElementNull("Données d'enregistrement nulles");

        if (utilisateurRepository.existsByEmail(dto.getEmail()))
            throw new ElementDejaExistant("Email déjà utilisé : " + dto.getEmail());

        Utilisateur utilisateur = createUtilisateurFromRole(dto);
        utilisateur.setMotDePasse(passwordEncoder.encode(dto.getMotDePasse()));
        utilisateurRepository.save(utilisateur);
    }

    private Utilisateur createUtilisateurFromRole(AuthDTO.RegisterRequest dto) {
        Utilisateur utilisateur = switch (dto.getRole()) {
            case ETUDIANT -> {
                Etudiant etudiant = new Etudiant();
                etudiant.setNumeroEtudiant(dto.getNumeroEtudiant());
                etudiant.setFiliere(dto.getFiliere());
                etudiant.setNiveau(dto.getNiveau());
                etudiant.setPromotion(dto.getPromotion());
                yield etudiant;
            }
            case ENTREPRISE -> {
                Entreprise entreprise = new Entreprise();
                entreprise.setNomEntreprise(dto.getNomEntreprise());
                entreprise.setSecteurActivite(dto.getSecteurActivite());
                entreprise.setAdresse(dto.getAdresse());
                entreprise.setVille(dto.getVille());
                entreprise.setTelephone(dto.getTelephoneEntreprise());
                yield entreprise;
            }
            case ENCADRANT -> {
                Encadrant encadrant = new Encadrant();
                encadrant.setPoste(dto.getPoste());
                encadrant.setDepartement(dto.getDepartement());
                encadrant.setTelephone(dto.getTelephoneEncadrant());
                yield encadrant;
            }
            case ADMIN -> {
                Admin admin = new Admin();
                admin.setNiveauAcces(dto.getNiveauAcces() != null ? dto.getNiveauAcces() : 1);
                yield admin;
            }
        };

        utilisateur.setNom(dto.getNom());
        utilisateur.setPrenom(dto.getPrenom());
        utilisateur.setEmail(dto.getEmail());
        utilisateur.setRole(dto.getRole());
        utilisateur.setActif(true);

        return utilisateur;
    }



}