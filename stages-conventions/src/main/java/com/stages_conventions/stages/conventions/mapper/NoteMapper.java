package com.stages_conventions.stages.conventions.mapper;

import com.stages_conventions.stages.conventions.dto.NoteDTO;
import com.stages_conventions.stages.conventions.model.Note;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;


@Mapper(componentModel = "spring")
public interface NoteMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateAttribution", ignore = true)

    @Mapping(target = "rubrique", ignore = true)
    @Mapping(target = "jury", ignore = true)
    @Mapping(target = "soutenance", ignore = true)

    Note toEntity(NoteDTO.CreateInput dto);

    @Mapping(source = "rubrique.id", target = "idRubrique")
    @Mapping(source = "rubrique.intitule", target = "rubriqueNom")

    @Mapping(source = "jury.id", target = "idJury")

    @Mapping(source = "soutenance.id", target = "idSoutenance")

    NoteDTO.Output toOutput(Note entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateAttribution", ignore = true)

    @Mapping(target = "rubrique", ignore = true)
    @Mapping(target = "jury", ignore = true)
    @Mapping(target = "soutenance", ignore = true)

    void updateEntity(NoteDTO.UpdateInput dto,
                      @MappingTarget Note note);
}