package com.stages_conventions.stages.conventions.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.stages_conventions.stages.conventions.enums.RoleEnum;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.EXISTING_PROPERTY,
        property = "role",
        visible = true
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = Etudiant.class, name = "ETUDIANT"),
        @JsonSubTypes.Type(value = Admin.class, name = "ADMIN"),
        @JsonSubTypes.Type(value = Entreprise.class, name = "ENTREPRISE"),
        @JsonSubTypes.Type(value = Encadrant.class, name = "ENCADRANT")
})
public abstract class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;

    @Column(unique = true)
    @Email(message = "Format d'email invalide")
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String motDePasse;

    @Enumerated(EnumType.STRING)
    private RoleEnum role;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate dateCreation;

    private boolean actif;

    @OneToMany(mappedBy = "signataire")
    private List<Signature> signatures;

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDate.now();
    }
}