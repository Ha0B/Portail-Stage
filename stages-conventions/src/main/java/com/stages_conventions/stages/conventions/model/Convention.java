package com.stages_conventions.stages.conventions.model;

import com.stages_conventions.stages.conventions.enums.StatutConventionEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Convention {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "stage_id", nullable = false)
    private Stage stage;

    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String sujetStage;

    @Enumerated(EnumType.STRING)
    private StatutConventionEnum statut;

    private Boolean signee = false;

    private String sha256Hash;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String signatureImage;

    @OneToMany(mappedBy = "convention", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Signature> signatures = new ArrayList<>();

}