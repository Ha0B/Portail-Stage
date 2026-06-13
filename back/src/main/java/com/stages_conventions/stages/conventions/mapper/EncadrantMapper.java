package com.stages_conventions.stages.conventions.mapper;

import com.stages_conventions.stages.conventions.dto.EncadrantDTO;
import com.stages_conventions.stages.conventions.model.Encadrant;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;


@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface EncadrantMapper {

    Encadrant toEntity(EncadrantDTO.CreateInput dto);

    EncadrantDTO.Output toOutput(Encadrant entity);

    void updateEntity(EncadrantDTO.UpdateInput dto, @MappingTarget Encadrant encadrant);
}