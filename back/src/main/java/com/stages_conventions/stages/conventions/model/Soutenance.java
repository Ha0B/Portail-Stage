package com.stages_conventions.stages.conventions.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.stages_conventions.stages.conventions.enums.StatutSoutenanceEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Soutenance {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @JsonFormat( shape =  JsonFormat.Shape.STRING , pattern = "dd-MM-yyyy")
    private LocalDate date;
    @JsonFormat( shape =  JsonFormat.Shape.STRING , pattern = "hh:mm")
    private LocalTime heure;
    private String salle;
    private int duree;
    @Enumerated(EnumType.STRING)
    private StatutSoutenanceEnum statut;

    @OneToOne @JoinColumn(name = "stage_id")
    private Stage stage;

    @OneToMany(mappedBy = "soutenance")
    private List<Jury> membresJury;

    @OneToMany(mappedBy = "soutenance")
    private List<Note> notes;
}