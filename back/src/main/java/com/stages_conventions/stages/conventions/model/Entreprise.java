package com.stages_conventions.stages.conventions.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Entity
@Table(name = "entreprise")
@PrimaryKeyJoinColumn(name = "id_utilisateur")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Entreprise extends Utilisateur {

    private String nomEntreprise;
    private String secteurActivite;
    private String adresse;
    private String ville;
    private String siteWeb;
    private String telephone;

    @Column(length = 1000)
    private String description;

    @OneToMany(mappedBy = "entreprise")
    private List<Offre> offres;
}