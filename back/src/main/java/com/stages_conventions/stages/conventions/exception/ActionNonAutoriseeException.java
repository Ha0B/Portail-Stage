package com.stages_conventions.stages.conventions.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class ActionNonAutoriseeException extends RuntimeException {
    public ActionNonAutoriseeException(String message) {
        super(message);
    }
}