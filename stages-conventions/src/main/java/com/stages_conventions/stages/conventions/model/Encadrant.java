package com.stages_conventions.stages.conventions.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.List;

@Entity
@Table(name = "encadrant")
@PrimaryKeyJoinColumn(name = "id_utilisateur")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Encadrant extends Utilisateur {
    private String poste;
    private String departement;
    private String telephone;

    @JsonIgnore
    @OneToMany(mappedBy = "encadrant")
    private List<Stage> stagesEncadres;

    @JsonIgnore
    @OneToMany(mappedBy = "encadrant")
    private List<Jury> participationsJury;
}