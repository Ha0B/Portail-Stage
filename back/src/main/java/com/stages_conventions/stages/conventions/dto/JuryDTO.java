package com.stages_conventions.stages.conventions.dto;

import com.stages_conventions.stages.conventions.enums.RoleJuryEnum;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

public class JuryDTO {

    @Data
    public static class CreateInput {

        @NotNull(message = "Role obligatoire")
        private RoleJuryEnum roleJury;

        @NotNull(message = "Soutenance obligatoire")
        private Long soutenanceId;

        @NotNull(message = "Encadrant obligatoire")
        private Long encadrantId;
    }

    @Data
    public static class UpdateInput {

        private RoleJuryEnum roleJury;

        private Long soutenanceId;

        private Long encadrantId;
    }

    @Data
    public static class Output {

        private Long id;

        private RoleJuryEnum roleJury;

        private Long soutenanceId;

        private Long encadrantId;

        private List<Long> notesAttribueesIds;
    }
}