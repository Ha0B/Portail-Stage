package com.stages_conventions.stages.conventions.model;

import com.stages_conventions.stages.conventions.enums.PrioriteEnum;
import com.stages_conventions.stages.conventions.enums.StatutObjectifEnum;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Objectif {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String description;
    private LocalDate dateEcheance;
    @Enumerated(EnumType.STRING)
    private StatutObjectifEnum statut;
    @Enumerated(EnumType.STRING)
    private PrioriteEnum priorite;

    @ManyToOne @JoinColumn(name = "stage_id")
    private Stage stage;
}