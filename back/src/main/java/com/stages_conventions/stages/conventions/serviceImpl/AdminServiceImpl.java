package com.stages_conventions.stages.conventions.serviceImpl;

import com.stages_conventions.stages.conventions.dto.AdminDTO;
import com.stages_conventions.stages.conventions.model.Admin;
import com.stages_conventions.stages.conventions.exception.ElementDejaExistant;
import com.stages_conventions.stages.conventions.exception.ElementNull;
import com.stages_conventions.stages.conventions.exception.UtilisateurNonTrouver;
import com.stages_conventions.stages.conventions.mapper.AdminMapper;
import com.stages_conventions.stages.conventions.repository.AdminRepository;
import com.stages_conventions.stages.conventions.service.AdminService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;
    private final AdminMapper adminMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AdminDTO.Output ajouterAdmin(AdminDTO.CreateInput dto) {
        if (dto == null) throw new ElementNull("Admin ne peut pas être null");

        if (adminRepository.findByEmail(dto.getEmail()) != null)
            throw new ElementDejaExistant("Email déjà utilisé");

        Admin admin = adminMapper.toEntity(dto);
        admin.setMotDePasse(passwordEncoder.encode(dto.getMotDePasse()));
        admin.setActif(true);

        return adminMapper.toOutput(adminRepository.save(admin));
    }

    @Override
    public AdminDTO.Output chercherAdminId(Long id) {
        if (id == null || id <= 0) throw new ElementNull("ID invalide");

        return adminRepository.findById(id)
                .map(adminMapper::toOutput)
                .orElseThrow(() -> new UtilisateurNonTrouver("Admin introuvable"));
    }

    @Override
    public AdminDTO.Output chercherAdminEmail(String email) {
        if (email == null || email.isBlank()) throw new ElementNull("Email invalide");

        Admin admin = adminRepository.findByEmail(email);
        if (admin == null) throw new UtilisateurNonTrouver("Admin introuvable");

        return adminMapper.toOutput(admin);
    }

    @Override
    public List<AdminDTO.Output> listerAdmins() {
        return adminRepository.findAll()
                .stream()
                .map(adminMapper::toOutput)
                .toList();
    }

    @Override
    public AdminDTO.Output supprimerAdmin(Long id) {
        if (id == null || id <= 0) throw new ElementNull("ID invalide");

        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new UtilisateurNonTrouver("Admin introuvable"));

        adminRepository.delete(admin);
        return adminMapper.toOutput(admin);
    }

    @Override
    public AdminDTO.Output modifierAdmin(Long id, AdminDTO.UpdateInput dto) {
        if (id == null || id <= 0) throw new ElementNull("ID invalide");
        if (dto == null) throw new ElementNull("Données de modification nulles");

        Admin existing = adminRepository.findById(id)
                .orElseThrow(() -> new UtilisateurNonTrouver("Admin introuvable"));

        if (!dto.getEmail().equals(existing.getEmail())) {
            if (adminRepository.findByEmail(dto.getEmail()) != null)
                throw new ElementDejaExistant("Email déjà utilisé : " + dto.getEmail());
        }

        adminMapper.updateEntity(dto, existing);

        if (dto.getMotDePasse() != null && !dto.getMotDePasse().isBlank())
            existing.setMotDePasse(passwordEncoder.encode(dto.getMotDePasse()));

        return adminMapper.toOutput(adminRepository.save(existing));
    }

    @Override
    public void changerMotDePasse(Long id, String ancienMDP, String nouveauMDP) {
        if (ancienMDP == null || ancienMDP.isBlank()) throw new ElementNull("Ancien mot de passe invalide");
        if (nouveauMDP == null || nouveauMDP.isBlank()) throw new ElementNull("Nouveau mot de passe invalide");

        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new UtilisateurNonTrouver("Admin introuvable"));

        if (!passwordEncoder.matches(ancienMDP, admin.getMotDePasse()))
            throw new ElementNull("Ancien mot de passe incorrect");

        admin.setMotDePasse(passwordEncoder.encode(nouveauMDP));
        adminRepository.save(admin);
    }
}