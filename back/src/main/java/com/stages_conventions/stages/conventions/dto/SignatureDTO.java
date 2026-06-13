package com.stages_conventions.stages.conventions.dto;

import com.stages_conventions.stages.conventions.enums.StatutConventionEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class SignatureDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OtpRequest {
        private String otp;
        private String signatureImage;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long idConvention;
        private StatutConventionEnum statut;
        private boolean estSignee;
        private boolean enAttenteSignature;
    }

}