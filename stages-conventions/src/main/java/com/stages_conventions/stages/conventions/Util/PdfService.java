package com.stages_conventions.stages.conventions.Util;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.stages_conventions.stages.conventions.model.Convention;
import com.stages_conventions.stages.conventions.model.Entreprise;
import com.stages_conventions.stages.conventions.model.Etudiant;
import com.stages_conventions.stages.conventions.model.Stage;
import com.stages_conventions.stages.conventions.repository.ConventionRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.security.MessageDigest;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PdfService {

    private final ConventionRepository conventionRepository;

    public void genererConventionPdf(HttpServletResponse response, Convention convention) throws Exception {
        Stage stage = convention.getStage();
        Entreprise entreprise = stage.getEntreprise();
        Etudiant etudiant = stage.getEtudiant();

        // 1. Chargement du template
        ClassPathResource resource = new ClassPathResource("templates/convention.html");
        String html = Files.readString(resource.getFile().toPath(), StandardCharsets.UTF_8);

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        // Durée en semaines
        long semaines = 0;
        if (stage.getDateDebut() != null && stage.getDateFin() != null) {
            semaines = ChronoUnit.WEEKS.between(stage.getDateDebut(), stage.getDateFin());
        }
        String dureeTotale = semaines + " semaine" + (semaines > 1 ? "s" : "");


        // --- Entreprise ---
        html = html.replace("{{nomEntreprise}}", nvl(entreprise.getNomEntreprise()));
        html = html.replace("{{adresseEntreprise}}", nvl(entreprise.getAdresse()));
        html = html.replace("{{villeEntreprise}}", nvl(entreprise.getVille()));
        html = html.replace("{{telephoneEntreprise}}", nvl(entreprise.getTelephone()));
        html = html.replace("{{nomResponsable}}", entreprise.getNom() + " " + entreprise.getPrenom());
        html = html.replace("{{emailEntreprise}}", nvl(entreprise.getEmail()));

        // --- Étudiant ---
        html = html.replace("{{prenomEtudiant}}", nvl(etudiant.getPrenom()));
        html = html.replace("{{nomEtudiant}}", nvl(etudiant.getNom()));
        html = html.replace("{{telephoneEtudiant}}", nvl(etudiant.getNumeroEtudiant()));
        html = html.replace("{{emailEtudiant}}", nvl(etudiant.getEmail()));
        html = html.replace("{{filiere}}", nvl(etudiant.getFiliere()));
        html = html.replace("{{niveau}}", nvl(etudiant.getNiveau()));
        html = html.replace("{{promotion}}", nvl(etudiant.getPromotion()));

        // --- Stage ---
        html = html.replace("{{dateDebut}}", stage.getDateDebut() != null ? stage.getDateDebut().format(dateFormatter) : "");
        html = html.replace("{{dateFin}}", stage.getDateFin() != null ? stage.getDateFin().format(dateFormatter) : "");
        html = html.replace("{{dureeTotale}}", dureeTotale);

        // --- Signature (texte) ---
        html = html.replace("{{villeEntreprise}}", nvl(entreprise.getVille()));
        html = html.replace("{{dateImpre}}", LocalDate.now().format(dateFormatter));
        html = html.replace("{{nomResponsable}}", entreprise.getNom() + " " + entreprise.getPrenom());
        html = html.replace("{{fonctionResponsable}}", "Non renseigné");

        // Gestion du bloc conditionnel "signee" (une seule fois, avec IP réelle)
        if (convention.getSignee() != null && convention.getSignee()) {
            html = html.replace("{{#signee}}", "");
            html = html.replace("{{/signee}}", "");
        } else {
            html = html.replaceAll("\\{\\{#signee\\}\\}.*?\\{\\{/signee\\}\\}", "");
        }

        // Gestion du bloc conditionnel "signatureImage"
        if (convention.getSignatureImage() != null && !convention.getSignatureImage().isBlank()) {
            html = html.replace("{{#signatureImage}}", "");
            html = html.replace("{{/signatureImage}}", "");
            html = html.replace("{{signatureImage}}", convention.getSignatureImage());
        } else {
            html = html.replaceAll("\\{\\{#signatureImage\\}\\}.*?\\{\\{/signatureImage\\}\\}", "");
        }

        // ===================== GÉNÉRATION DU PDF =====================
        ByteArrayOutputStream pdfStream = new ByteArrayOutputStream();
        PdfRendererBuilder builder = new PdfRendererBuilder();
        builder.withHtmlContent(html, null);
        builder.toStream(pdfStream);
        builder.run();

        byte[] pdfBytes = pdfStream.toByteArray();

        // Hash SHA-256
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        String sha256 = HexFormat.of().formatHex(digest.digest(pdfBytes));

        convention.setSha256Hash(sha256);
        conventionRepository.save(convention);

        log.info("PDF généré et hash SHA-256 sauvegardé pour la convention ID: {}", convention.getId());

        // Réponse HTTP
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=convention_" + convention.getId() + ".pdf");
        response.setContentLength(pdfBytes.length);
        response.getOutputStream().write(pdfBytes);
        response.getOutputStream().flush();
    }

    private String nvl(String value) {
        return value != null ? value : "";
    }
}