package com.stb.clientrequest.controller;

import com.stb.clientrequest.dto.LoginRequest;
import com.stb.clientrequest.dto.LoginResponse;
import com.stb.clientrequest.dto.RegisterClientRequest;
import com.stb.clientrequest.dto.RegisterClientResponse;
import com.stb.clientrequest.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(
        origins = {
                "http://localhost:4200",
                "http://localhost:4201"
        }
)
public class AuthController {

    private final AuthService authService;

    public AuthController(
            AuthService authService
    ) {
        this.authService = authService;
    }

    /*
     * INSCRIPTION CLIENT
     */
    @PostMapping("/register")
    public ResponseEntity<RegisterClientResponse> registerClient(
            @Valid
            @RequestBody
            RegisterClientRequest request
    ) {
        RegisterClientResponse response =
                authService.registerClient(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    /*
     * CONNEXION
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid
            @RequestBody
            LoginRequest request
    ) {
        LoginResponse response =
                authService.login(request);

        return ResponseEntity.ok(response);
    }
}