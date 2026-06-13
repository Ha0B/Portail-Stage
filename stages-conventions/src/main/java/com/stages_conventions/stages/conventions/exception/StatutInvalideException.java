package com.stages_conventions.stages.conventions.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class StatutInvalideException extends RuntimeException {
    public StatutInvalideException(String message) {
        super(message);
    }
}