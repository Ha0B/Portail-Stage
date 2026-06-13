package com.stages_conventions.stages.conventions.mapper;

import com.stages_conventions.stages.conventions.dto.ConventionDTO;
import com.stages_conventions.stages.conventions.model.Convention;
import com.stages_conventions.stages.conventions.model.Stage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ConventionMapper {

    @Mapping(source = "stage.id", target = "stageId")
    ConventionDTO.Output toOutput(Convention entity);

    @Mapping(source = "input.dateDebut", target = "dateDebut")
    @Mapping(source = "input.dateFin", target = "dateFin")
    @Mapping(source = "input.sujetStage", target = "sujetStage")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "statut", ignore = true)
    @Mapping(target = "sha256Hash", ignore = true)
    @Mapping(target = "signee", ignore = true)
    @Mapping(target = "signatureImage", ignore = true)
    @Mapping(target = "signatures", ignore = true)
    @Mapping(target = "stage", source = "stage")
    Convention toEntity(ConventionDTO.CreateInput input, Stage stage);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "stage", ignore = true)
    @Mapping(target = "sha256Hash", ignore = true)
    @Mapping(target = "signee", ignore = true)
    @Mapping(target = "signatureImage", ignore = true)
    @Mapping(target = "signatures", ignore = true)
    void updateEntity(ConventionDTO.UpdateInput input, @MappingTarget Convention entity);
}