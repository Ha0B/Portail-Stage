package com.stages_conventions.stages.conventions.serviceImpl;

import com.stages_conventions.stages.conventions.enums.StatutCandidatureEnum;
import com.stages_conventions.stages.conventions.enums.StatutConventionEnum;
import com.stages_conventions.stages.conventions.model.*;
import com.stages_conventions.stages.conventions.repository.CandidatureRepository;
import com.stages_conventions.stages.conventions.repository.ConventionRepository;
import com.stages_conventions.stages.conventions.repository.SoutenanceRepository;
import com.stages_conventions.stages.conventions.service.CsvService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CsvServiceImpl implements CsvService {
    private final CandidatureRepository candidatureRepository ;
    private final ConventionRepository conventionRepository ;
    private final SoutenanceRepository soutenanceRepository;
        @Override
        public ByteArrayInputStream exportCandidatures(
                Long offreId,
                String promo,
                StatutCandidatureEnum statut) {

            List<Candidature> candidatures;

            if (promo == null && statut == null) {
                candidatures = candidatureRepository.findByOffreId(offreId);
            } else if (statut == null) {
                candidatures = candidatureRepository.findByOffreIdAndEtudiantPromotion(offreId, promo);
            } else if (promo == null) {
                candidatures = candidatureRepository.findByOffreIdAndStatut(offreId, statut);
            } else {
                candidatures = candidatureRepository
                        .findByOffreIdAndEtudiantPromotionAndStatut(offreId, promo, statut);
            }

        try (Workbook workbook = new XSSFWorkbook()) {

            Sheet sheet = workbook.createSheet("Candidatures");

            Row header = sheet.createRow(0);

            header.createCell(0).setCellValue("ID");
            header.createCell(1).setCellValue("Date");
            header.createCell(2).setCellValue("Statut");
            header.createCell(3).setCellValue("Etudiant");
            header.createCell(4).setCellValue("Promotion");
            header.createCell(5).setCellValue("Offre");
            header.createCell(6).setCellValue("Entreprise");

            int rowNum = 1;

            for (Candidature c : candidatures) {

                Row row = sheet.createRow(rowNum++);

                row.createCell(0).setCellValue(c.getId());
                row.createCell(1).setCellValue(c.getDateCandidature().toString());
                row.createCell(2).setCellValue(c.getStatut().name());
                row.createCell(3).setCellValue(
                        c.getEtudiant().getNom() + " " +
                                c.getEtudiant().getPrenom()
                );
                row.createCell(4).setCellValue(
                        c.getEtudiant().getPromotion()
                );
                row.createCell(5).setCellValue(
                        c.getOffre().getTitre()
                );
                row.createCell(6).setCellValue(
                        c.getOffre().getEntreprise().getNomEntreprise()
                );
            }

            for (int i = 0; i < 7; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);

            return new ByteArrayInputStream(out.toByteArray());

        } catch ( IOException e) {
            throw new RuntimeException("Erreur lors de la génération Excel", e);
        }
    }

    @Override
    public ByteArrayInputStream exportPlanningSoutenances(String salle, String jury) {

        List<Soutenance> soutenances;

        boolean hasSalle = (salle != null && !salle.trim().isEmpty());
        boolean hasJury = (jury != null && !jury.trim().isEmpty());

        // recuperation des donnees avec filtre sur la salle
        if (hasSalle) {
            soutenances = soutenanceRepository.findBySalleContainingIgnoreCase(salle);
        } else {
            soutenances = soutenanceRepository.findAll();
        }

        // Filtre en memoire pour le jury (recherche dans le nom ou prenom de l'encadrant)
        if (hasJury) {
            String juryLower = jury.toLowerCase();
            soutenances = soutenances.stream()
                    .filter(s -> s.getMembresJury() != null && s.getMembresJury().stream()
                            .anyMatch(j -> j.getEncadrant() != null && (
                                    (j.getEncadrant().getNom() != null && j.getEncadrant().getNom().toLowerCase().contains(juryLower)) ||
                                            (j.getEncadrant().getPrenom() != null && j.getEncadrant().getPrenom().toLowerCase().contains(juryLower))
                            ))
                    ).collect(Collectors.toList());
        }

        // generer le fichier Excel
        try (Workbook workbook = new XSSFWorkbook()) {

            Sheet sheet = workbook.createSheet("Planning Soutenances");
            Row header = sheet.createRow(0);

            header.createCell(0).setCellValue("ID");
            header.createCell(1).setCellValue("Date");
            header.createCell(2).setCellValue("Heure");
            header.createCell(3).setCellValue("Salle");
            header.createCell(4).setCellValue("Durée (min)");
            header.createCell(5).setCellValue("Étudiant");
            header.createCell(6).setCellValue("Sujet de Stage");
            header.createCell(7).setCellValue("Membres du Jury");
            header.createCell(8).setCellValue("Statut");

            int rowNum = 1;

            for (Soutenance s : soutenances) {
                Row row = sheet.createRow(rowNum++);

                row.createCell(0).setCellValue(s.getId());
                row.createCell(1).setCellValue(s.getDate() != null ? s.getDate().toString() : "N/A");
                row.createCell(2).setCellValue(s.getHeure() != null ? s.getHeure().toString() : "N/A");
                row.createCell(3).setCellValue(s.getSalle() != null ? s.getSalle() : "N/A");
                row.createCell(4).setCellValue(s.getDuree());

                // Étudiant & Sujet
                if (s.getStage() != null && s.getStage().getEtudiant() != null) {
                    row.createCell(5).setCellValue(s.getStage().getEtudiant().getNom() + " " + s.getStage().getEtudiant().getPrenom());
                    row.createCell(6).setCellValue(s.getStage().getTitre() != null ? s.getStage().getTitre() : "N/A");
                } else {
                    row.createCell(5).setCellValue("N/A");
                    row.createCell(6).setCellValue("N/A");
                }

                // Formatage de la liste des membres du jury
                if (s.getMembresJury() != null && !s.getMembresJury().isEmpty()) {
                    String juryNames = s.getMembresJury().stream()
                            .filter(j -> j.getEncadrant() != null)
                            .map(j -> j.getEncadrant().getNom() + " " + j.getEncadrant().getPrenom() +
                                    (j.getRoleJury() != null ? " (" + j.getRoleJury().name() + ")" : ""))
                            .collect(Collectors.joining(", "));
                    row.createCell(7).setCellValue(juryNames.isEmpty() ? "N/A" : juryNames);
                } else {
                    row.createCell(7).setCellValue("N/A");
                }

                row.createCell(8).setCellValue(s.getStatut() != null ? s.getStatut().name() : "N/A");
            }

            // Ajustement automatique de la largeur des colonnes
            for (int i = 0; i < 9; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);

            return new ByteArrayInputStream(out.toByteArray());

        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la génération Excel des soutenances", e);
        }
    }

    @Override
    public ByteArrayInputStream exportConventions(String entrepriseNom, StatutConventionEnum statut) {

        List<Convention> conventions;

        boolean hasEntreprise = (entrepriseNom != null && !entrepriseNom.trim().isEmpty());

        if (!hasEntreprise && statut == null) {
            conventions = conventionRepository.findAll();
        } else if (!hasEntreprise) {
            conventions = conventionRepository.findByStatut(statut);
        } else if (statut == null) {
            conventions = conventionRepository.findByStage_Entreprise_nomEntrepriseLike("%" + entrepriseNom + "%");
        } else {
            conventions = conventionRepository.findByStatutAndStage_Entreprise_nomEntrepriseLike(statut, "%" + entrepriseNom + "%");
        }

        //  generer le fichier Excel
        try (Workbook workbook = new XSSFWorkbook()) {

            Sheet sheet = workbook.createSheet("Conventions");
            Row header = sheet.createRow(0);

            header.createCell(0).setCellValue("ID");
            header.createCell(1).setCellValue("Étudiant");
            header.createCell(2).setCellValue("Entreprise");
            header.createCell(3).setCellValue("Sujet de Stage");
            header.createCell(4).setCellValue("Date de Début");
            header.createCell(5).setCellValue("Date de Fin");
            header.createCell(6).setCellValue("Statut");

            int rowNum = 1;

            for (Convention c : conventions) {
                Row row = sheet.createRow(rowNum++);

                // id
                row.createCell(0).setCellValue(c.getId());

                // etudiant (via le Stage)
                if (c.getStage() != null && c.getStage().getEtudiant() != null) {
                    row.createCell(1).setCellValue(
                            c.getStage().getEtudiant().getNom() + " " + c.getStage().getEtudiant().getPrenom()
                    );
                } else {
                    row.createCell(1).setCellValue("N/A");
                }

                // Entreprise (via le Stage)
                if (c.getStage() != null && c.getStage().getEntreprise() != null) {
                    row.createCell(2).setCellValue(c.getStage().getEntreprise().getNomEntreprise());
                } else {
                    row.createCell(2).setCellValue("N/A");
                }

                // Informations de la convention
                row.createCell(3).setCellValue(c.getSujetStage() != null ? c.getSujetStage() : "N/A");
                row.createCell(4).setCellValue(c.getDateDebut() != null ? c.getDateDebut().toString() : "N/A");
                row.createCell(5).setCellValue(c.getDateFin() != null ? c.getDateFin().toString() : "N/A");
                row.createCell(6).setCellValue(c.getStatut() != null ? c.getStatut().name() : "N/A");

            }

            // Ajustement automatique de la largeur des colonnes
            for (int i = 0; i < 8; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);

            return new ByteArrayInputStream(out.toByteArray());

        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la génération Excel des conventions", e);
        }
    }

    @Override
    public ByteArrayInputStream exportNotes(Double min, Double max) {

        // On récupère toutes les soutenances
        List<Soutenance> soutenances = soutenanceRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook()) {

            Sheet sheet = workbook.createSheet("Notes et Moyennes");

            // Style pour permettre les retours à la ligne dans la cellule des détails
            CellStyle wrapStyle = workbook.createCellStyle();
            wrapStyle.setWrapText(true);

            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("ID Soutenance");
            header.createCell(1).setCellValue("Étudiant");
            header.createCell(2).setCellValue("Sujet de Stage");
            header.createCell(3).setCellValue("Détail des notes par Rubrique");
            header.createCell(4).setCellValue("Moyenne Générale");

            int rowNum = 1;

            for (Soutenance s : soutenances) {
                // On ignore les soutenances qui n'ont pas encore de notes
                if (s.getNotes() == null || s.getNotes().isEmpty()) {
                    continue;
                }

                // Grouper les notes par rubrique
                Map<Rubrique, List<Note>> notesParRubrique = s.getNotes().stream()
                        .collect(Collectors.groupingBy(Note::getRubrique));

                double sommePonderee = 0.0;
                double sommeCoefficients = 0.0;
                StringBuilder detailsBuilder = new StringBuilder();

                // Calculer la moyenne pour chaque rubrique
                for (Map.Entry<Rubrique, List<Note>> entry : notesParRubrique.entrySet()) {
                    Rubrique rubrique = entry.getKey();
                    List<Note> notesDeLaRubrique = entry.getValue();

                    // Moyenne donnee par les jurys pour cette rubrique precise
                    double moyenneRubrique = notesDeLaRubrique.stream()
                            .mapToDouble(Note::getValeur)
                            .average()
                            .orElse(0.0);

                    sommePonderee += moyenneRubrique * rubrique.getCoefficient();
                    sommeCoefficients += rubrique.getCoefficient();

                    // Ajouter au texte détaillé
                    detailsBuilder.append("- ")
                            .append(rubrique.getIntitule())
                            .append(" : ")
                            .append(String.format("%.2f", moyenneRubrique))
                            .append("/")
                            .append(rubrique.getNoteMax())
                            .append(" (Coef ")
                            .append(rubrique.getCoefficient())
                            .append(")\n");
                }

                // 3. Moyenne générale de la soutenance
                double moyenneGenerale = sommeCoefficients > 0 ? sommePonderee / sommeCoefficients : 0.0;

                // 4. Appliquer les filtres Min et Max du front-end
                if (min != null && moyenneGenerale < min) continue;
                if (max != null && moyenneGenerale > max) continue;

                // 5. Créer la ligne Excel
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(s.getId());

                if (s.getStage() != null && s.getStage().getEtudiant() != null) {
                    row.createCell(1).setCellValue(s.getStage().getEtudiant().getNom() + " " + s.getStage().getEtudiant().getPrenom());
                    row.createCell(2).setCellValue(s.getStage().getTitre() != null ? s.getStage().getTitre() : "N/A");
                } else {
                    row.createCell(1).setCellValue("N/A");
                    row.createCell(2).setCellValue("N/A");
                }

                org.apache.poi.ss.usermodel.Cell detailsCell = row.createCell(3);
                detailsCell.setCellValue(detailsBuilder.toString().trim());
                detailsCell.setCellStyle(wrapStyle); // Applique les retours à la ligne

                row.createCell(4).setCellValue(String.format("%.2f", moyenneGenerale));
            }

            // Ajustement automatique de la largeur des colonnes
            for (int i = 0; i < 5; i++) {
                sheet.autoSizeColumn(i);
            }
            // Fixer une largeur plus grande pour la colonne des détails pour bien voir les retours à la ligne
            sheet.setColumnWidth(3, 15000);

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);

            return new ByteArrayInputStream(out.toByteArray());

        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la génération Excel des notes", e);
        }
    }
}
