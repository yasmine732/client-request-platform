package com.stb.clientrequest.service;

import com.stb.clientrequest.dto.LoginRequest;
import com.stb.clientrequest.dto.LoginResponse;
import com.stb.clientrequest.dto.RegisterClientRequest;
import com.stb.clientrequest.dto.RegisterClientResponse;
import com.stb.clientrequest.entity.Client;
import com.stb.clientrequest.entity.User;
import com.stb.clientrequest.enums.Role;
import com.stb.clientrequest.repository.ClientRepository;
import com.stb.clientrequest.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final PasswordService passwordService;

    public AuthService(
            UserRepository userRepository,
            ClientRepository clientRepository,
            PasswordService passwordService
    ) {
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.passwordService = passwordService;
    }

    /*
     * INSCRIPTION D'UN CLIENT
     */
    @Transactional
    public RegisterClientResponse registerClient(
            RegisterClientRequest request
    ) {
        String email = request.email()
                .trim()
                .toLowerCase(Locale.ROOT);

        boolean userExiste =
                userRepository.existsByEmailIgnoreCase(email);

        boolean clientExiste =
                clientRepository.existsByEmailIgnoreCase(email);

        if (userExiste || clientExiste) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Un compte existe déjà avec cette adresse e-mail"
            );
        }

        /*
         * Création du compte utilisateur.
         */
        User user = new User();

        user.setNom(
                request.nom().trim()
        );

        user.setPrenom(
                request.prenom().trim()
        );

        user.setEmail(email);

        user.setMotDePasse(
                passwordService.hashPassword(
                        request.motDePasse()
                )
        );

        user.setRole(Role.CLIENT);
        user.setActif(true);

        User savedUser =
                userRepository.save(user);

        /*
         * Création automatique de la fiche client.
         */
        Client client = new Client();

        client.setTypeClient(
                request.typeClient()
        );

        client.setNom(
                request.nom().trim()
        );

        client.setPrenom(
                request.prenom().trim()
        );

        client.setEmail(email);

        client.setTelephone(
                request.telephone().trim()
        );

        client.setActif(true);

        Client savedClient =
                clientRepository.save(client);

        return new RegisterClientResponse(
                savedUser.getId(),
                savedClient.getId(),
                savedClient.getReferenceClient(),
                savedUser.getEmail(),
                savedUser.getRole(),
                "Compte client créé avec succès"
        );
    }

    /*
     * CONNEXION
     */
    public LoginResponse login(
            LoginRequest request
    ) {
        String email = request.email()
                .trim()
                .toLowerCase(Locale.ROOT);

        /*
         * Rechercher l'utilisateur par son e-mail.
         */
        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(
                        () -> new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Adresse e-mail ou mot de passe incorrect"
                        )
                );

        /*
         * Vérifier que le compte est actif.
         */
        if (!user.isActif()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Ce compte est désactivé"
            );
        }

        /*
         * Vérifier le mot de passe.
         */
        boolean motDePasseCorrect =
                passwordService.matches(
                        request.motDePasse(),
                        user.getMotDePasse()
                );

        if (!motDePasseCorrect) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Adresse e-mail ou mot de passe incorrect"
            );
        }

        /*
         * Pour un CLIENT, retrouver automatiquement son clientId.
         * Pour ADMIN ou AGENT, clientId reste null.
         */
        Long clientId = null;

        if (user.getRole() == Role.CLIENT) {
            clientId = clientRepository
                    .findByEmailIgnoreCase(email)
                    .map(Client::getId)
                    .orElseThrow(
                            () -> new ResponseStatusException(
                                    HttpStatus.NOT_FOUND,
                                    "Aucune fiche client associée à ce compte"
                            )
                    );
        }

        return new LoginResponse(
                user.getId(),
                clientId,
                user.getNom(),
                user.getPrenom(),
                user.getEmail(),
                user.getRole(),
                "Connexion réussie"
        );
    }
}