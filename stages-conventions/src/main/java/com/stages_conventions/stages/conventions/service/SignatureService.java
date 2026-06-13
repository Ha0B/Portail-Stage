package com.stages_conventions.stages.conventions.service;

import com.stages_conventions.stages.conventions.model.Convention;
import com.stages_conventions.stages.conventions.model.Signature;
import com.stages_conventions.stages.conventions.model.Utilisateur;

import java.util.List;

public interface SignatureService {

    Signature signerConvention(
            Convention convention,
            Utilisateur signataire,
            String otp,
            String ip,
            String userAgent,
            String signatureImage
    );

    List<Signature> getByConventionId(Long conventionId);

    boolean estSignee(Long conventionId);

    boolean aDejaSigne(Long conventionId, Long utilisateurId);
}