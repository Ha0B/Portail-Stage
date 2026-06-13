package com.stages_conventions.stages.conventions.model;

import com.stages_conventions.stages.conventions.enums.StatutSignatureEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Signature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "convention_id", nullable = false)
    private Convention convention;

    @ManyToOne
    @JoinColumn(name = "signataire_id", nullable = false)
    private Utilisateur signataire;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String signatureImage;

    @Column(nullable = false)
    private LocalDateTime horodatage;

    @Column(nullable = false)
    private String adresseIp;

    @Column(nullable = false, length = 1000)
    private String userAgent;

    @Column(nullable = false, length = 64)
    private String sha256Document;

    @Enumerated(EnumType.STRING)
    private StatutSignatureEnum statut;
}