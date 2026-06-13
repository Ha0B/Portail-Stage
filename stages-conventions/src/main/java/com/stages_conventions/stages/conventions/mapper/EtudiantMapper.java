package com.stages_conventions.stages.conventions.mapper;

import com.stages_conventions.stages.conventions.dto.EtudiantDTO;
import com.stages_conventions.stages.conventions.model.Etudiant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper( componentModel = "spring" )
public interface EtudiantMapper {

    Etudiant toEntity(EtudiantDTO.CreateInput dto);

    @Mapping(target = "idCandidatures",
            expression = "java(entity.getCandidatures() != null ? entity.getCandidatures().stream().map(c -> c.getId()).toList() : null)")
    @Mapping(target = "idStages",
            expression = "java(entity.getStages() != null ? entity.getStages().stream().map(s -> s.getId()).toList() : null)")
    EtudiantDTO.Output toOutput(Etudiant entity);

    void updateEntity(
            EtudiantDTO.UpdateInput dto,
            @MappingTarget Etudiant etudiant
    );
}