package com.stb.clientrequest.service;

import com.stb.clientrequest.entity.Client;
import com.stb.clientrequest.enums.TypeClient;
import com.stb.clientrequest.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;

    public List<Client> obtenirTousLesClients() {
        return clientRepository.findAll(
                Sort.by(
                        Sort.Direction.DESC,
                        "dateCreation"
                )
        );
    }

    public Client obtenirClientParId(Long id) {
        return clientRepository
                .findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Client introuvable avec l'id : "
                                        + id
                        )
                );
    }

    public List<Client> rechercherClients(
            String texte
    ) {
        if (
                texte == null
                || texte.isBlank()
        ) {
            return obtenirTousLesClients();
        }

        return clientRepository.rechercher(
                texte.trim()
        );
    }

    public Client ajouterClient(
            Client client
    ) {
        normaliserClient(client);
        verifierClient(client);

        if (
                clientRepository
                        .existsByEmailIgnoreCase(
                                client.getEmail()
                        )
        ) {
            throw new RuntimeException(
                    "Un client possède déjà cette adresse email"
            );
        }

        return clientRepository.save(client);
    }

    public Client modifierClient(
            Long id,
            Client nouvellesInformations
    ) {
        Client clientExistant =
                obtenirClientParId(id);

        normaliserClient(
                nouvellesInformations
        );

        verifierClient(
                nouvellesInformations
        );

        boolean emailModifie =
                !clientExistant
                        .getEmail()
                        .equalsIgnoreCase(
                                nouvellesInformations
                                        .getEmail()
                        );

        if (
                emailModifie
                && clientRepository
                .existsByEmailIgnoreCase(
                        nouvellesInformations
                                .getEmail()
                )
        ) {
            throw new RuntimeException(
                    "Un client possède déjà cette adresse email"
            );
        }

        clientExistant.setTypeClient(
                nouvellesInformations
                        .getTypeClient()
        );

        clientExistant.setNom(
                nouvellesInformations.getNom()
        );

        clientExistant.setPrenom(
                nouvellesInformations
                        .getPrenom()
        );

        clientExistant.setRaisonSociale(
                nouvellesInformations
                        .getRaisonSociale()
        );

        clientExistant.setEmail(
                nouvellesInformations
                        .getEmail()
        );

        clientExistant.setTelephone(
                nouvellesInformations
                        .getTelephone()
        );

        clientExistant.setAdresse(
                nouvellesInformations
                        .getAdresse()
        );

        clientExistant.setActif(
                nouvellesInformations
                        .isActif()
        );

        return clientRepository.save(
                clientExistant
        );
    }

    public Client modifierEtat(
            Long id,
            boolean actif
    ) {
        Client client =
                obtenirClientParId(id);

        client.setActif(actif);

        return clientRepository.save(client);
    }

    public void supprimerClient(Long id) {
        Client client =
                obtenirClientParId(id);

        clientRepository.delete(client);
    }

    private void verifierClient(
            Client client
    ) {
        if (client.getTypeClient() == null) {
            throw new RuntimeException(
                    "Le type du client est obligatoire"
            );
        }

        if (
                client.getEmail() == null
                || client.getEmail().isBlank()
        ) {
            throw new RuntimeException(
                    "L’adresse email est obligatoire"
            );
        }

        if (
                client.getTelephone() == null
                || client.getTelephone().isBlank()
        ) {
            throw new RuntimeException(
                    "Le numéro de téléphone est obligatoire"
            );
        }

        if (
                client.getTypeClient()
                        == TypeClient.PARTICULIER
        ) {
            if (
                    client.getNom() == null
                    || client.getNom().isBlank()
                    || client.getPrenom() == null
                    || client.getPrenom().isBlank()
            ) {
                throw new RuntimeException(
                        "Le nom et le prénom sont obligatoires pour un particulier"
                );
            }

            client.setRaisonSociale(null);
        }

        if (
                client.getTypeClient()
                        == TypeClient.ENTREPRISE
        ) {
            if (
                    client.getRaisonSociale() == null
                    || client.getRaisonSociale()
                    .isBlank()
            ) {
                throw new RuntimeException(
                        "La raison sociale est obligatoire pour une entreprise"
                );
            }

            client.setNom(null);
            client.setPrenom(null);
        }
    }

    private void normaliserClient(
            Client client
    ) {
        if (client.getEmail() != null) {
            client.setEmail(
                    client.getEmail()
                            .trim()
                            .toLowerCase()
            );
        }

        if (client.getTelephone() != null) {
            client.setTelephone(
                    client.getTelephone()
                            .trim()
            );
        }

        if (client.getNom() != null) {
            client.setNom(
                    client.getNom().trim()
            );
        }

        if (client.getPrenom() != null) {
            client.setPrenom(
                    client.getPrenom().trim()
            );
        }

        if (
                client.getRaisonSociale()
                        != null
        ) {
            client.setRaisonSociale(
                    client.getRaisonSociale()
                            .trim()
            );
        }

        if (client.getAdresse() != null) {
            client.setAdresse(
                    client.getAdresse().trim()
            );
        }
    }
}