package com.stages_conventions.stages.conventions.service;

import com.stages_conventions.stages.conventions.enums.StatutCandidatureEnum;
import com.stages_conventions.stages.conventions.enums.StatutConventionEnum;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;

@Service
public interface CsvService {

    ByteArrayInputStream exportCandidatures(
            Long offreId,
            String promo,
            StatutCandidatureEnum statut
        );

    ByteArrayInputStream exportPlanningSoutenances(
            String salle ,
            String jury
        );

    ByteArrayInputStream exportNotes(Double min, Double max);

    ByteArrayInputStream exportConventions(
            String entrepriseNom,
            StatutConventionEnum statut
        );
}
