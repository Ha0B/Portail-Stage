package com.stages_conventions.stages.conventions.model;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name = "admin")
@PrimaryKeyJoinColumn(name = "id_utilisateur")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Admin extends Utilisateur {
    private int niveauAcces;
}