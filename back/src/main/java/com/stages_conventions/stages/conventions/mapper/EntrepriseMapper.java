package com.stages_conventions.stages.conventions.mapper;

import com.stages_conventions.stages.conventions.dto.EntrepriseDTO;
import com.stages_conventions.stages.conventions.model.Entreprise;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface EntrepriseMapper {

    Entreprise toEntity(EntrepriseDTO.CreateInput dto);

    @Mapping(target = "idOffres",
            expression = "java(entity.getOffres() != null ? entity.getOffres().stream().map(offre -> offre.getId()).toList() : null)")
    EntrepriseDTO.Output toOutput(Entreprise entity);

    void updateEntity(
            EntrepriseDTO.UpdateInput dto,
            @MappingTarget Entreprise entreprise
    );
}