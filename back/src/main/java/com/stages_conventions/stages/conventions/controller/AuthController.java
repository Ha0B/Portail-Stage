package com.stages_conventions.stages.conventions.controller;

import com.stages_conventions.stages.conventions.dto.AuthDTO;
import com.stages_conventions.stages.conventions.serviceImpl.AuthService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public AuthDTO.LoginResponse login(
            @RequestBody @Valid AuthDTO.LoginRequest dto) {

        return authService.login(dto);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(
            @RequestBody @Valid AuthDTO.RegisterRequest dto) {

        authService.register(dto);
    }
}
