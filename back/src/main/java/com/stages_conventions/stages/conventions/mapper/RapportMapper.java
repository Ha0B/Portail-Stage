package com.stages_conventions.stages.conventions.mapper;

import com.stages_conventions.stages.conventions.dto.RapportDTO;
import com.stages_conventions.stages.conventions.model.Rapport;
import com.stages_conventions.stages.conventions.model.Stage;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy =
                NullValuePropertyMappingStrategy.IGNORE
)
public interface RapportMapper {

    @Mapping(source = "idStage",
            target = "stage",
            qualifiedByName = "stageFromId")

    @Mapping(target = "fichierNom", ignore = true)
    @Mapping(target = "fichierType", ignore = true)
    @Mapping(target = "fichierData", ignore = true)

    @Mapping(target = "dateSoumission", ignore = true)
    @Mapping(target = "statutRapport", ignore = true)
    @Mapping(target = "commentaire", ignore = true)

    Rapport toEntity(RapportDTO.CreateInput dto);

    @Mapping(source = "stage.id", target = "idStage")
    RapportDTO.Output toOutput(Rapport entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "stage", ignore = true)
    @Mapping(target = "dateSoumission", ignore = true)
    @Mapping(target = "statutRapport", ignore = true)
    @Mapping(target = "commentaire", ignore = true)

    @Mapping(target = "fichierNom", ignore = true)
    @Mapping(target = "fichierType", ignore = true)
    @Mapping(target = "fichierData", ignore = true)

    void updateEntity(
            RapportDTO.UpdateInput dto,
            @MappingTarget Rapport rapport
    );

    @Named("stageFromId")
    static Stage stageFromId(Long id) {

        if (id == null) {
            return null;
        }

        Stage stage = new Stage();
        stage.setId(id);

        return stage;
    }
}