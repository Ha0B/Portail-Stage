package com.stages_conventions.stages.conventions.service;

import com.stages_conventions.stages.conventions.dto.AdminDTO;
import java.util.List;

public interface AdminService {

    AdminDTO.Output ajouterAdmin(AdminDTO.CreateInput dto);

    AdminDTO.Output chercherAdminId(Long id);

    AdminDTO.Output chercherAdminEmail(String email);

    List<AdminDTO.Output> listerAdmins();

    AdminDTO.Output supprimerAdmin(Long id);

    AdminDTO.Output modifierAdmin(Long id, AdminDTO.UpdateInput dto);

    void changerMotDePasse(Long id, String ancienMDP, String nouveauMDP);
}