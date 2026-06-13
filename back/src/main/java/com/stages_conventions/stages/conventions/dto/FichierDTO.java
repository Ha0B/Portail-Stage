package com.stages_conventions.stages.conventions.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class FichierDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private String nom;
        private String url;
        private Long size;
        private String contentType;
    }
}
