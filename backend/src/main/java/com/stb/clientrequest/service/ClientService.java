package com.stb.clientrequest.service;

import com.stb.clientrequest.entity.Client;
import com.stb.clientrequest.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;

    // Afficher tous les clients
    public List<Client> obtenirTousLesClients() {
        return clientRepository.findAll();
    }

    // Afficher un client par son identifiant
    public Client obtenirClientParId(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Client introuvable avec l'identifiant : " + id
                ));
    }

    // Ajouter un nouveau client
    public Client ajouterClient(Client client) {

        if (clientRepository.existsByEmail(client.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Un client possède déjà cet email"
            );
        }

        return clientRepository.save(client);
    }

    // Modifier un client
    public Client modifierClient(Long id, Client nouvellesInformations) {

        Client clientExistant = obtenirClientParId(id);

        boolean emailModifie =
                !clientExistant.getEmail()
                        .equalsIgnoreCase(nouvellesInformations.getEmail());

        if (emailModifie
                && clientRepository.existsByEmail(
                        nouvellesInformations.getEmail()
                )) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Un client possède déjà cet email"
            );
        }

        clientExistant.setNom(nouvellesInformations.getNom());
        clientExistant.setPrenom(nouvellesInformations.getPrenom());
        clientExistant.setEmail(nouvellesInformations.getEmail());
        clientExistant.setTelephone(nouvellesInformations.getTelephone());
        clientExistant.setAdresse(nouvellesInformations.getAdresse());

        return clientRepository.save(clientExistant);
    }

    // Supprimer un client
    public void supprimerClient(Long id) {

        Client clientExistant = obtenirClientParId(id);

        clientRepository.delete(clientExistant);
    }
}