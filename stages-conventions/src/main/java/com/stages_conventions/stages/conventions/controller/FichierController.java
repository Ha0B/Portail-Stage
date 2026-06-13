package com.stages_conventions.stages.conventions.controller;

import com.stages_conventions.stages.conventions.dto.FichierDTO;
import com.stages_conventions.stages.conventions.serviceImpl.FichierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/fichier")
public class FichierController {

    private final FichierService fichierService;

    @PostMapping(
            value = "/upload/cv/{idEtudiant}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @ResponseStatus(HttpStatus.CREATED)
    public FichierDTO.Response uploadCv(
            @PathVariable Long idEtudiant,
            @RequestParam("file") MultipartFile file
    ) {

        return fichierService.uploadCv(
                idEtudiant,
                file
        );
    }
}