package com.stages_conventions.stages.conventions.mapper;

import com.stages_conventions.stages.conventions.dto.OffreDTO;
import com.stages_conventions.stages.conventions.model.Entreprise;
import com.stages_conventions.stages.conventions.model.Offre;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface OffreMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "datePublication", ignore = true)
    @Mapping(target = "statut", ignore = true)
    @Mapping(target = "candidatures", ignore = true)
    @Mapping(target = "entreprise", source = "entreprise")
    @Mapping(source = "dto.description", target = "description")
    @Mapping(source = "dto.titre", target = "titre")
    Offre toEntity(OffreDTO.CreateInput dto, Entreprise entreprise);

    @Mapping(target = "entrepriseId", source = "entity.entreprise.id")
    @Mapping(target = "entrepriseNom", source = "entity.entreprise.nom")
    @Mapping(target = "entrepriseEmail", source = "entity.entreprise.email")
    @Mapping(target = "nombreCandidatures", expression = "java(entity.getCandidatures() != null ? entity.getCandidatures().size() : 0)")
    OffreDTO.Output toOutput(Offre entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "datePublication", ignore = true)
    @Mapping(target = "entreprise", ignore = true)
    @Mapping(target = "candidatures", ignore = true)
    @Mapping(target = "statut", ignore = true)
    void updateEntity(OffreDTO.UpdateInput dto, @MappingTarget Offre offre);
}