package com.stages_conventions.stages.conventions.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.stages_conventions.stages.conventions.enums.StatutOffreEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Offre {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titre;
    @Column(length = 2000)
    private String description;
    @JsonFormat(shape =  JsonFormat.Shape.STRING , pattern = "dd-MM-yyyy")
    private LocalDate datePublication;
    @JsonFormat(shape =  JsonFormat.Shape.STRING , pattern = "dd-MM-yyyy")
    private LocalDate dateExpiration;
    private int duree;
    private double remuneration;
    private String lieu;
    private String competencesRequises;
    @Enumerated(EnumType.STRING)
    private StatutOffreEnum statut;

    @ManyToOne
    @JoinColumn(name = "entreprise_id")
    @JsonBackReference
    private Entreprise entreprise;

    @OneToMany(mappedBy = "offre")
    private List<Candidature> candidatures;

    @PrePersist
    public void setDatePublication() {
        this.datePublication = LocalDate.now() ;
    }



}