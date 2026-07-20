package com.stb.clientrequest.controller;

import com.stb.clientrequest.entity.User;
import com.stb.clientrequest.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<User> obtenirTousLesUtilisateurs() {
        return userService.obtenirTousLesUtilisateurs();
    }

    @GetMapping("/{id}")
    public User obtenirUtilisateurParId(@PathVariable Long id) {
        return userService.obtenirUtilisateurParId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public User ajouterUtilisateur(
            @Valid @RequestBody User user
    ) {
        return userService.ajouterUtilisateur(user);
    }

    @PutMapping("/{id}")
    public User modifierUtilisateur(
            @PathVariable Long id,
            @Valid @RequestBody User user
    ) {
        return userService.modifierUtilisateur(id, user);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void supprimerUtilisateur(@PathVariable Long id) {
        userService.supprimerUtilisateur(id);
    }
}
