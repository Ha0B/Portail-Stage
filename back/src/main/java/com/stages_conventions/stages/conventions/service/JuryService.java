package com.stages_conventions.stages.conventions.service;

import com.stages_conventions.stages.conventions.dto.JuryDTO;
import java.util.List;

public interface JuryService {

    List<JuryDTO.Output> listeJury();

    JuryDTO.Output trouverJury(String nomComplet);

    void affecterJury(JuryDTO.CreateInput dto);

    void retirerJury(Long encadrantId);

    void modifierJury(Long id, JuryDTO.UpdateInput dto);

    List<JuryDTO.Output> getJuryByEncadantId(Long id);

    List<JuryDTO.Output> getJuryBySoutenanceId(Long id);
}