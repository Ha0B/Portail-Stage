package com.stages_conventions.stages.conventions.model;

import com.stages_conventions.stages.conventions.enums.RoleJuryEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor @NoArgsConstructor
public class Jury {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private RoleJuryEnum roleJury;

    @ManyToOne @JoinColumn(name = "soutenance_id")
    private Soutenance soutenance;

    @OneToMany(mappedBy = "jury")
    private List<Note> notesAttribuees;

    @ManyToOne
    @JoinColumn(name = "encadrant_id")
    private Encadrant encadrant;
}