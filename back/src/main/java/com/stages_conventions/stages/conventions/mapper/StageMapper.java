package com.stages_conventions.stages.conventions.mapper;

import com.stages_conventions.stages.conventions.dto.StageDTO;
import com.stages_conventions.stages.conventions.model.Stage;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface StageMapper {

    // create
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "statut", ignore = true)
    @Mapping(target = "convention", ignore = true)
    @Mapping(target = "etudiant", ignore = true)
    @Mapping(target = "entreprise", ignore = true)
    @Mapping(target = "encadrant", ignore = true)
    @Mapping(target = "objectifs", ignore = true)
    @Mapping(target = "rapport", ignore = true)
    @Mapping(target = "soutenance", ignore = true)
    Stage toEntity(StageDTO.CreateInput dto);

    // output
    @Mapping(source = "etudiant.id", target = "etudiantId")
    @Mapping(source = "etudiant.nom", target = "nomEtudiant")
    @Mapping(source = "etudiant.prenom", target = "prenomEtudiant")
    @Mapping(source = "entreprise.nomEntreprise", target = "nomEntreprise")
    @Mapping(source = "encadrant.nom", target = "nomEncadrant")
    StageDTO.Output toOutput(Stage stage);

    // update
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "etudiant", ignore = true)
    @Mapping(target = "entreprise", ignore = true)
    @Mapping(target = "encadrant", ignore = true)
    @Mapping(target = "convention", ignore = true)
    @Mapping(target = "objectifs", ignore = true)
    @Mapping(target = "rapport", ignore = true)
    @Mapping(target = "soutenance", ignore = true)
    void updateEntity(StageDTO.UpdateInput dto, @MappingTarget Stage stage);


    @Mapping(source = "id", target = "stageId")
    @Mapping(source = "etudiant.id", target = "etudiantId")
    @Mapping(source = "etudiant.nom", target = "nom")
    @Mapping(source = "etudiant.prenom", target = "prenom")
    @Mapping(source = "etudiant.email", target = "email")
    @Mapping(source = "entreprise.nomEntreprise", target = "entreprise")
    @Mapping(source = "statut", target = "statut")
    @Mapping(source = "dateDebut", target = "dateDebut")
    @Mapping(source = "dateFin", target = "dateFin")
    StageDTO.StagiaireDTO toStagiaireDTO(Stage stage);

}
