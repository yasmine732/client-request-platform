package com.stb.clientrequest.controller;

import com.stb.clientrequest.entity.Client;
import com.stb.clientrequest.service.ClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @GetMapping
    public List<Client> obtenirTousLesClients() {
        return clientService
                .obtenirTousLesClients();
    }

    @GetMapping("/{id}")
    public Client obtenirClientParId(
            @PathVariable Long id
    ) {
        return clientService
                .obtenirClientParId(id);
    }

    @GetMapping("/recherche")
    public List<Client> rechercherClients(
            @RequestParam String texte
    ) {
        return clientService
                .rechercherClients(texte);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Client ajouterClient(
            @Valid
            @RequestBody
            Client client
    ) {
        return clientService
                .ajouterClient(client);
    }

    @PutMapping("/{id}")
    public Client modifierClient(
            @PathVariable Long id,

            @Valid
            @RequestBody
            Client client
    ) {
        return clientService
                .modifierClient(
                        id,
                        client
                );
    }

    @PatchMapping("/{id}/etat")
    public Client modifierEtat(
            @PathVariable Long id,
            @RequestParam boolean actif
    ) {
        return clientService
                .modifierEtat(
                        id,
                        actif
                );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(
            HttpStatus.NO_CONTENT
    )
    public void supprimerClient(
            @PathVariable Long id
    ) {
        clientService
                .supprimerClient(id);
    }
}