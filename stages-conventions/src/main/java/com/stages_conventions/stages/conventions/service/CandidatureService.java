package com.stages_conventions.stages.conventions.service;

import com.stages_conventions.stages.conventions.dto.CandidatureDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface CandidatureService {

    CandidatureDTO.Output soummettre(MultipartFile file, CandidatureDTO.CreateInput input) throws IOException;

    CandidatureDTO.Output accepterCandidature(Long id);

    CandidatureDTO.Output refuserCandidature(Long id);

    void annulerCandidature(Long id);

    CandidatureDTO.Output recupererCandidature(Long id);

    List<CandidatureDTO.Output> listerCandidatures();

    CandidatureDTO.Output modifierCandidature(Long id, CandidatureDTO.UpdateInput input);

    List<CandidatureDTO.Output> recupererCandidaturesEtudiant(Long etudiantId);

    List<CandidatureDTO.Output> recupererCandidaturesOffre(Long offreId);

    byte[] recupererCv(Long candidatureId);
}