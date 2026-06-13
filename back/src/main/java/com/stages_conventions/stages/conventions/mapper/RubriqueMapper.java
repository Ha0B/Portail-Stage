package com.stages_conventions.stages.conventions.mapper;

import com.stages_conventions.stages.conventions.dto.RubriqueDTO;
import com.stages_conventions.stages.conventions.model.Rubrique;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RubriqueMapper {

    Rubrique toEntity(RubriqueDTO.CreateInput dto);

    void updateEntity(RubriqueDTO.UpdateInput dto, @MappingTarget Rubrique entity);

    RubriqueDTO.Output toOutput(Rubrique entity);
}