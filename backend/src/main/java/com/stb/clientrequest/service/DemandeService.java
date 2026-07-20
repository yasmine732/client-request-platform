package com.stb.clientrequest.service;

import com.stb.clientrequest.entity.Client;
import com.stb.clientrequest.entity.Demande;
import com.stb.clientrequest.entity.User;
import com.stb.clientrequest.enums.Role;
import com.stb.clientrequest.enums.StatutDemande;
import com.stb.clientrequest.repository.ClientRepository;
import com.stb.clientrequest.repository.DemandeRepository;
import com.stb.clientrequest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DemandeService {

    private final DemandeRepository demandeRepository;
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;

    // Afficher toutes les demandes
    public List<Demande> obtenirToutesLesDemandes() {
        return demandeRepository.findAll();
    }

    // Afficher une demande par son identifiant
    public Demande obtenirDemandeParId(Long id) {
        return demandeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Demande introuvable avec l'identifiant : " + id
                ));
    }

    // Ajouter une demande
    public Demande ajouterDemande(Demande demande) {

        Client client = verifierClient(demande);
        User agent = verifierAgent(demande);

        demande.setClient(client);
        demande.setAgentResponsable(agent);

        if (demande.getStatut() == StatutDemande.FERMEE) {
            demande.setDateCloture(LocalDateTime.now());
        }

        return demandeRepository.save(demande);
    }

    // Modifier une demande
    public Demande modifierDemande(
            Long id,
            Demande nouvellesInformations
    ) {

        Demande demandeExistante = obtenirDemandeParId(id);

        Client client = verifierClient(nouvellesInformations);
        User agent = verifierAgent(nouvellesInformations);

        demandeExistante.setTitre(nouvellesInformations.getTitre());
        demandeExistante.setDescription(
                nouvellesInformations.getDescription()
        );
        demandeExistante.setCategorie(
                nouvellesInformations.getCategorie()
        );
        demandeExistante.setPriorite(
                nouvellesInformations.getPriorite()
        );
        demandeExistante.setStatut(
                nouvellesInformations.getStatut()
        );
        demandeExistante.setClient(client);
        demandeExistante.setAgentResponsable(agent);

        if (nouvellesInformations.getStatut()
                == StatutDemande.FERMEE) {

            if (demandeExistante.getDateCloture() == null) {
                demandeExistante.setDateCloture(
                        LocalDateTime.now()
                );
            }

        } else {
            demandeExistante.setDateCloture(null);
        }

        return demandeRepository.save(demandeExistante);
    }

    // Supprimer une demande
    public void supprimerDemande(Long id) {

        Demande demande = obtenirDemandeParId(id);

        demandeRepository.delete(demande);
    }

    // Vérifier que le client existe
    private Client verifierClient(Demande demande) {

        if (demande.getClient() == null
                || demande.getClient().getId() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "L'identifiant du client est obligatoire"
            );
        }

        Long clientId = demande.getClient().getId();

        return clientRepository.findById(clientId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Client introuvable avec l'identifiant : "
                                + clientId
                ));
    }

    // Vérifier que l'agent existe et possède le rôle AGENT
    private User verifierAgent(Demande demande) {

        if (demande.getAgentResponsable() == null) {
            return null;
        }

        if (demande.getAgentResponsable().getId() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "L'identifiant de l'agent est obligatoire"
            );
        }

        Long agentId =
                demande.getAgentResponsable().getId();

        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Utilisateur introuvable avec l'identifiant : "
                                + agentId
                ));

        if (agent.getRole() != Role.AGENT) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "L'utilisateur sélectionné n'a pas le rôle AGENT"
            );
        }

        return agent;
    }
}