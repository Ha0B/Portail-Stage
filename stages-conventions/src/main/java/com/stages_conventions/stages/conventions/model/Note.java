package com.stages_conventions.stages.conventions.model;

import com.stages_conventions.stages.conventions.enums.TypeNoteEnum;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double valeur;

    private String appreciation;

    private LocalDateTime dateAttribution;

    @ManyToOne
    @JoinColumn(name = "rubrique_id", nullable = false)
    private Rubrique rubrique;

    @ManyToOne
    @JoinColumn(name = "jury_id", nullable = false)
    private Jury jury;

    @ManyToOne
    @JoinColumn(name = "soutenance_id", nullable = false)
    private Soutenance soutenance;

    @PrePersist
    public void prePersist() {
        this.dateAttribution = LocalDateTime.now();
    }
}