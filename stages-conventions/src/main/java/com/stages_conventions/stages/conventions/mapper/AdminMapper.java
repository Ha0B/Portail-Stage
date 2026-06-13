package com.stages_conventions.stages.conventions.mapper;

import com.stages_conventions.stages.conventions.dto.AdminDTO;
import com.stages_conventions.stages.conventions.model.Admin;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface AdminMapper {

    Admin toEntity(AdminDTO.CreateInput dto);

    AdminDTO.Output toOutput(Admin entity);

    void updateEntity(AdminDTO.UpdateInput dto, @MappingTarget Admin admin);
}