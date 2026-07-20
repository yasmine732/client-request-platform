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

    // Afficher tous les utilisateurs
    public List<User> obtenirTousLesUtilisateurs() {
        return userRepository.findAll();
    }

    // Afficher un utilisateur par son identifiant
    public User obtenirUtilisateurParId(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Utilisateur introuvable avec l'id : " + id));
    }

    // Ajouter un utilisateur
    public User ajouterUtilisateur(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Un utilisateur possède déjà cet email");
        }

        return userRepository.save(user);
    }

    // Modifier un utilisateur
    public User modifierUtilisateur(Long id, User nouvellesInformations) {

        User utilisateurExistant = obtenirUtilisateurParId(id);

        if (!utilisateurExistant.getEmail().equals(nouvellesInformations.getEmail())
                && userRepository.existsByEmail(nouvellesInformations.getEmail())) {
            throw new RuntimeException("Un utilisateur possède déjà cet email");
        }

        utilisateurExistant.setNom(nouvellesInformations.getNom());
        utilisateurExistant.setPrenom(nouvellesInformations.getPrenom());
        utilisateurExistant.setEmail(nouvellesInformations.getEmail());
        utilisateurExistant.setMotDePasse(nouvellesInformations.getMotDePasse());
        utilisateurExistant.setRole(nouvellesInformations.getRole());
        utilisateurExistant.setActif(nouvellesInformations.isActif());

        return userRepository.save(utilisateurExistant);
    }

    // Supprimer un utilisateur
    public void supprimerUtilisateur(Long id) {

        User utilisateur = obtenirUtilisateurParId(id);

        userRepository.delete(utilisateur);
    }
}