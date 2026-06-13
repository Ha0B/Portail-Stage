package com.stages_conventions.stages.conventions.service;

import com.stages_conventions.stages.conventions.model.Utilisateur;
import java.util.List;

public interface UtilisateurService {

    Utilisateur getCurrentUser();

    Utilisateur ajouterUtilisateur(Utilisateur utilisateur);

    Utilisateur chercherUtilId(Long idUtilisateur);

    Utilisateur chercherUtilEmail(String emailUtilisateur);

    List<Utilisateur> listerUtilisateurs();

    boolean supprimerUtilisateur(Long idUtilisateur);

    Utilisateur modifierUtilisateur(Long id, Utilisateur newUtilisateur);
}