package com.stages_conventions.stages.conventions.mapper;

import com.stages_conventions.stages.conventions.dto.SoutenanceDTO;
import com.stages_conventions.stages.conventions.model.Soutenance;
import com.stages_conventions.stages.conventions.model.Stage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface SoutenanceMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "statut", ignore = true)
    @Mapping(target = "membresJury", ignore = true)
    @Mapping(target = "stage", source = "stage")
    @Mapping(target = "notes", ignore = true)
    Soutenance toEntity(SoutenanceDTO.CreateInput dto, Stage stage);

    @Mapping(target = "idStage", source = "entity.stage.id")
    SoutenanceDTO.Output toOutput(Soutenance entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "membresJury", ignore = true)
    @Mapping(target = "stage", ignore = true)
    @Mapping(target = "notes", ignore = true)
    void updateEntity(SoutenanceDTO.UpdateInput dto, @MappingTarget Soutenance soutenance);
}