package com.stages_conventions.stages.conventions.repository;

import com.stages_conventions.stages.conventions.model.Signature;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SignatureRepository extends JpaRepository<Signature, Long> {

    List<Signature> findByConventionId(
            Long conventionId
    );

    boolean existsByConventionIdAndSignataireId(
            Long conventionId,
            Long signataireId
    );
}