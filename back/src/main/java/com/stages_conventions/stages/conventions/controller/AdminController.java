package com.stages_conventions.stages.conventions.controller;

import com.stages_conventions.stages.conventions.dto.AdminDTO;
import com.stages_conventions.stages.conventions.service.AdminService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@AllArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/lister")
    @ResponseStatus(HttpStatus.OK)
    public List<AdminDTO.Output> listerAdmins() {
        return adminService.listerAdmins();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public AdminDTO.Output chercherAdminId(
            @PathVariable Long id) {

        return adminService.chercherAdminId(id);
    }

    @GetMapping("/email/{email}")
    @ResponseStatus(HttpStatus.OK)
    public AdminDTO.Output chercherAdminEmail(
            @PathVariable String email) {

        return adminService.chercherAdminEmail(email);
    }

    @PostMapping("/ajouter")
    @ResponseStatus(HttpStatus.CREATED)
    public AdminDTO.Output ajouterAdmin(
            @RequestBody @Valid AdminDTO.CreateInput dto) {

        return adminService.ajouterAdmin(dto);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public AdminDTO.Output modifierAdmin(
            @PathVariable Long id,
            @RequestBody @Valid AdminDTO.UpdateInput dto) {

        return adminService.modifierAdmin(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public AdminDTO.Output supprimerAdmin(
            @PathVariable Long id) {

        return adminService.supprimerAdmin(id);
    }

    @PutMapping("/{id}/changer-motdepasse")
    @ResponseStatus(HttpStatus.OK)
    public void changerMotDePasse(
            @PathVariable Long id,
            @RequestParam String ancienMDP,
            @RequestParam String nouveauMDP) {

        adminService.changerMotDePasse(
                id,
                ancienMDP,
                nouveauMDP
        );
    }
}
