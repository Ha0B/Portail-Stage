package com.stages_conventions.stages.conventions.serviceImpl;

import com.stages_conventions.stages.conventions.dto.FichierDTO;
import com.stages_conventions.stages.conventions.exception.ElementNull;
import com.stages_conventions.stages.conventions.model.Etudiant;
import com.stages_conventions.stages.conventions.repository.EtudiantRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class FichierService {

    private final EtudiantRepository etudiantRepository;

    private final Path root = Paths.get("uploads/cv");

    public FichierDTO.Response uploadCv(
            Long idEtudiant,
            MultipartFile file    ) {
        try {

            if (file.isEmpty()) {
                throw new ElementNull("Le fichier est vide");
            }

            if (!"application/pdf".equals(file.getContentType())) {
                throw new RuntimeException("Seuls les PDF sont autorisés");
            }

            if (!Files.exists(root)) { Files.createDirectories(root);  }

            String fileName =  UUID.randomUUID() + "_" + file.getOriginalFilename();

            Files.copy(
                    file.getInputStream(),
                    root.resolve(fileName),
                    StandardCopyOption.REPLACE_EXISTING
            );

            Etudiant etudiant = etudiantRepository.findById(idEtudiant)
                    .orElseThrow(() ->
                            new ElementNull("Étudiant introuvable"));

            etudiant.setCv(fileName);

            etudiantRepository.save(etudiant);

           return new FichierDTO.Response(
                   fileName,
                   "/uploads/cv/" + fileName,
                   file.getSize(),
                   file.getContentType()
                );

        } catch (IOException e) {
            throw new RuntimeException(
                    "Erreur upload fichier"
            );
        }
    }
}