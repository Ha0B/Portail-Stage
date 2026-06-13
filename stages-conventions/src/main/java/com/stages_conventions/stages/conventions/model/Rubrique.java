package com.stages_conventions.stages.conventions.model;

import com.stages_conventions.stages.conventions.enums.TypeRubriqueEnum;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Rubrique {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String intitule;

    private String description;

    @Column(nullable = false)
    private double coefficient;

    @Column(nullable = false)
    private double noteMax;

    @Enumerated(EnumType.STRING)
    private TypeRubriqueEnum typeRubrique;

    @OneToMany(mappedBy = "rubrique")
    private List<Note> notes;

}