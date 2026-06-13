package com.stages_conventions.stages.conventions.serviceImpl;

import com.stages_conventions.stages.conventions.model.Utilisateur;
import com.stages_conventions.stages.conventions.exception.ElementDejaExistant;
import com.stages_conventions.stages.conventions.exception.ElementNonTrouver;
import com.stages_conventions.stages.conventions.exception.ElementNull;
import com.stages_conventions.stages.conventions.repository.UtilisateurRepository;
import com.stages_conventions.stages.conventions.service.UtilisateurService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class UtilisateurServiceImpl implements UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;


    // Recuperer l'utilisateur actuellement connecte via le contexte de securite
    @Override
    public Utilisateur getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new ElementNonTrouver("Aucun utilisateur authentifié ou session expirée");
        }

        String email;
        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }

        return utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new ElementNonTrouver("Utilisateur connecté introuvable dans la base de données : " + email));
    }

    @Override
    public Utilisateur ajouterUtilisateur(Utilisateur utilisateur) {
        if (utilisateurRepository.existsByEmail(utilisateur.getEmail())) {
            throw new ElementDejaExistant("Email déjà utilisé : " + utilisateur.getEmail());
        }

        utilisateur.setMotDePasse(passwordEncoder.encode(utilisateur.getMotDePasse()));
        return utilisateurRepository.save(utilisateur);
    }

    @Override
    public Utilisateur chercherUtilId(Long idUtilisateur) {
        return utilisateurRepository.findById(idUtilisateur)
                .orElse(null);
    }

    @Override
    public Utilisateur chercherUtilEmail(String emailUtilisateur) {
        return utilisateurRepository.findByEmail(emailUtilisateur)
                .orElse(null);
    }

    @Override
    public List<Utilisateur> listerUtilisateurs() {
        return utilisateurRepository.findAll();
    }

    @Override
    public boolean supprimerUtilisateur(Long idUtilisateur) {
        Utilisateur utilisateur = chercherUtilId(idUtilisateur);
        if (utilisateur == null) {
            return false;
        }
        utilisateurRepository.delete(utilisateur);
        return true;
    }

    @Override
    public Utilisateur modifierUtilisateur(Long id, Utilisateur newUtilisateur) {
        if (newUtilisateur == null) {
            throw new ElementNull("Utilisateur à modifier est null");
        }

        Utilisateur oldUtilisateur = chercherUtilId(id);

        if (oldUtilisateur == null) {
            throw new ElementNonTrouver("Utilisateur avec ID non trouvé : " + id);
        }

        oldUtilisateur.setNom(newUtilisateur.getNom());
        oldUtilisateur.setPrenom(newUtilisateur.getPrenom());
        oldUtilisateur.setEmail(newUtilisateur.getEmail());

        if (newUtilisateur.getMotDePasse() != null && !newUtilisateur.getMotDePasse().isBlank()) {
            oldUtilisateur.setMotDePasse(passwordEncoder.encode(newUtilisateur.getMotDePasse()));
        }

        oldUtilisateur.setActif(newUtilisateur.isActif());

        return utilisateurRepository.save(oldUtilisateur);
    }
}