package com.stages_conventions.stages.conventions.mapper;

import com.stages_conventions.stages.conventions.dto.CandidatureDTO;
import com.stages_conventions.stages.conventions.model.Candidature;
import com.stages_conventions.stages.conventions.model.Etudiant;
import com.stages_conventions.stages.conventions.model.Offre;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface CandidatureMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateCandidature", ignore = true)
    @Mapping(target = "statut", ignore = true)

    @Mapping(target = "cvNom", ignore = true)
    @Mapping(target = "cvType", ignore = true)
    @Mapping(target = "cvData", ignore = true)

    @Mapping(target = "etudiant", source = "etudiant")
    @Mapping(target = "offre", source = "offre")

    @Mapping(target = "lettreMotivation", source = "dto.lettreMotivation")

    Candidature toEntity(
            CandidatureDTO.CreateInput dto,
            Etudiant etudiant,
            Offre offre
    );

    @Mapping(target = "idEtudiant", source = "etudiant.id")
    @Mapping(target = "idOffre", source = "offre.id")
    CandidatureDTO.Output toOutput(Candidature entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateCandidature", ignore = true)
    @Mapping(target = "statut", ignore = true)

    @Mapping(target = "etudiant", ignore = true)
    @Mapping(target = "offre", ignore = true)

    @Mapping(target = "cvNom", ignore = true)
    @Mapping(target = "cvType", ignore = true)
    @Mapping(target = "cvData", ignore = true)

    void updateEntity(
            CandidatureDTO.UpdateInput dto,
            @MappingTarget Candidature candidature
    );
}