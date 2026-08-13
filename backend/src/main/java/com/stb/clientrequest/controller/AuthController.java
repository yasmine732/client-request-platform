package com.stb.clientrequest.controller;

import com.stb.clientrequest.dto.LoginRequest;
import com.stb.clientrequest.dto.LoginResponse;
import com.stb.clientrequest.dto.RegisterClientRequest;
import com.stb.clientrequest.dto.RegisterClientResponse;
import com.stb.clientrequest.service.AuthService;
import com.stb.clientrequest.service.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(
        origins = {
                "http://localhost:4200",
                "http://localhost:4201"
        },
        allowCredentials = "true"
)
public class AuthController {

    private static final String COOKIE_NAME =
            "CLIENTFLOW_TOKEN";

    private final AuthService authService;

    private final JwtService jwtService;

    public AuthController(
            AuthService authService,
            JwtService jwtService
    ) {
        this.authService =
                authService;

        this.jwtService =
                jwtService;
    }

    /*
     * INSCRIPTION CLIENT
     */
    @PostMapping("/register")
    public ResponseEntity<RegisterClientResponse>
    registerClient(
            @Valid
            @RequestBody
            RegisterClientRequest request
    ) {

        RegisterClientResponse response =
                authService.registerClient(
                        request
                );

        return ResponseEntity
                .status(
                        HttpStatus.CREATED
                )
                .body(response);
    }

    /*
     * CONNEXION
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse>
    login(
            @Valid
            @RequestBody
            LoginRequest request
    ) {

        LoginResponse response =
                authService.login(
                        request
                );

        String token =
                jwtService.generateToken(
                        response
                );

        ResponseCookie cookie =
                ResponseCookie
                        .from(
                                COOKIE_NAME,
                                token
                        )
                        .httpOnly(true)
                        .secure(false)
                        .sameSite("Lax")
                        .path("/")
                        .maxAge(
                                Duration.ofHours(8)
                        )
                        .build();

        return ResponseEntity
                .ok()
                .header(
                        HttpHeaders.SET_COOKIE,
                        cookie.toString()
                )
                .body(response);
    }

    /*
     * UTILISATEUR CONNECTÉ
     */
    @GetMapping("/me")
    public ResponseEntity<LoginResponse>
    getCurrentUser(
            @CookieValue(
                    name = COOKIE_NAME,
                    required = false
            )
            String token
    ) {

        if (
                token == null ||
                token.isBlank()
        ) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Utilisateur non connecté"
            );
        }

        try {

            LoginResponse response =
                    jwtService.validateToken(
                            token
                    );

            return ResponseEntity
                    .ok(response);

        } catch (
                IllegalArgumentException exception
        ) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Session invalide ou expirée"
            );
        }
    }

    /*
     * DÉCONNEXION
     */
    @PostMapping("/logout")
    public ResponseEntity<Void>
    logout() {

        ResponseCookie cookie =
                ResponseCookie
                        .from(
                                COOKIE_NAME,
                                ""
                        )
                        .httpOnly(true)
                        .secure(false)
                        .sameSite("Lax")
                        .path("/")
                        .maxAge(
                                Duration.ZERO
                        )
                        .build();

        return ResponseEntity
                .noContent()
                .header(
                        HttpHeaders.SET_COOKIE,
                        cookie.toString()
                )
                .build();
    }
}