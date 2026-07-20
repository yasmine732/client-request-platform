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
@CrossOrigin(origins = "http://localhost:4200")
public class ClientController {

    private final ClientService clientService;

    @GetMapping
    public List<Client> obtenirTousLesClients() {
        return clientService.obtenirTousLesClients();
    }

    @GetMapping("/{id}")
    public Client obtenirClientParId(@PathVariable Long id) {
        return clientService.obtenirClientParId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Client ajouterClient(@Valid @RequestBody Client client) {
        return clientService.ajouterClient(client);
    }

    @PutMapping("/{id}")
    public Client modifierClient(
            @PathVariable Long id,
            @Valid @RequestBody Client client
    ) {
        return clientService.modifierClient(id, client);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void supprimerClient(@PathVariable Long id) {
        clientService.supprimerClient(id);
    }
}