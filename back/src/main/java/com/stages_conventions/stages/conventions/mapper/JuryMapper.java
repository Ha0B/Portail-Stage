package com.stages_conventions.stages.conventions.mapper;

import com.stages_conventions.stages.conventions.dto.JuryDTO;
import com.stages_conventions.stages.conventions.model.Jury;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface JuryMapper {

    @Mapping(target = "soutenance", ignore = true)
    @Mapping(target = "encadrant", ignore = true)
    @Mapping(target = "notesAttribuees", ignore = true)
    Jury toEntity(JuryDTO.CreateInput dto);

    @Mapping(source = "soutenance.id", target = "soutenanceId")
    @Mapping(source = "encadrant.id", target = "encadrantId")
    @Mapping(target = "notesAttribueesIds",
            expression = "java(entity.getNotesAttribuees() != null ? entity.getNotesAttribuees().stream().map(n -> n.getId()).toList() : null)")
    JuryDTO.Output toOutput(Jury entity);

    void updateEntity(JuryDTO.UpdateInput dto, @MappingTarget Jury jury);
}