package com.stages_conventions.stages.conventions.mapper;

import com.stages_conventions.stages.conventions.dto.ObjectifDTO;
import com.stages_conventions.stages.conventions.model.Objectif;
import com.stages_conventions.stages.conventions.model.Stage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ObjectifMapper {

    @Mapping(source = "idStage", target = "stage", qualifiedByName = "stageFromId")
    Objectif toEntity(ObjectifDTO.CreateInput dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "stage", ignore = true)
    @Mapping(target = "dateEcheance", ignore = true)
    void updateEntity(ObjectifDTO.UpdateInput dto, @MappingTarget Objectif entity);

    @Mapping(source = "stage.id", target = "idStage")
    ObjectifDTO.Output toOutput(Objectif entity);

    @Named("stageFromId")
    static Stage stageFromId(Long id) {
        if (id == null) return null;
        Stage stage = new Stage();
        stage.setId(id);
        return stage;
    }
}