package com.stb.clientrequest.service;

import com.stb.clientrequest.entity.User;
import com.stb.clientrequest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> obtenirTousLesUtilisateurs() {
        return userRepository.findAll();
    }

    public User obtenirUtilisateurParId(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Utilisateur introuvable avec l'id : " + id
                        )
                );
    }

    public User ajouterUtilisateur(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException(
                    "Un utilisateur possède déjà cet email"
            );
        }

        verifierMotDePasse(user.getMotDePasse());

        return userRepository.save(user);
    }

    public User modifierUtilisateur(
            Long id,
            User nouvellesInformations
    ) {

        User utilisateurExistant =
                obtenirUtilisateurParId(id);

        boolean emailModifie =
                !utilisateurExistant
                        .getEmail()
                        .equalsIgnoreCase(
                                nouvellesInformations.getEmail()
                        );

        if (
                emailModifie
                && userRepository.existsByEmail(
                        nouvellesInformations.getEmail()
                )
        ) {
            throw new RuntimeException(
                    "Un utilisateur possède déjà cet email"
            );
        }

        utilisateurExistant.setNom(
                nouvellesInformations.getNom()
        );

        utilisateurExistant.setPrenom(
                nouvellesInformations.getPrenom()
        );

        utilisateurExistant.setEmail(
                nouvellesInformations.getEmail()
        );

        utilisateurExistant.setRole(
                nouvellesInformations.getRole()
        );

        utilisateurExistant.setActif(
                nouvellesInformations.isActif()
        );

        /*
         * Le mot de passe est modifié uniquement lorsqu'un
         * nouveau mot de passe est envoyé par le frontend.
         */
        String nouveauMotDePasse =
                nouvellesInformations.getMotDePasse();

        if (
                nouveauMotDePasse != null
                && !nouveauMotDePasse.isBlank()
        ) {
            verifierMotDePasse(nouveauMotDePasse);

            utilisateurExistant.setMotDePasse(
                    nouveauMotDePasse
            );
        }

        return userRepository.save(
                utilisateurExistant
        );
    }

    public void supprimerUtilisateur(Long id) {

        User utilisateur =
                obtenirUtilisateurParId(id);

        userRepository.delete(utilisateur);
    }

    private void verifierMotDePasse(
            String motDePasse
    ) {
        if (
                motDePasse == null
                || motDePasse.isBlank()
                || motDePasse.length() < 8
        ) {
            throw new RuntimeException(
                    "Le mot de passe doit contenir au moins 8 caractères"
            );
        }
    }
}