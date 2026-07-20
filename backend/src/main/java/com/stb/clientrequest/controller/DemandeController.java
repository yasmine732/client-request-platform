package com.stb.clientrequest.controller;

import com.stb.clientrequest.entity.Demande;
import com.stb.clientrequest.service.DemandeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/demandes")
@RequiredArgsConstructor
public class DemandeController {

    private final DemandeService demandeService;

    // GET : afficher toutes les demandes
    @GetMapping
    public List<Demande> obtenirToutesLesDemandes() {
        return demandeService.obtenirToutesLesDemandes();
    }

    // GET : afficher une demande par son identifiant
    @GetMapping("/{id}")
    public Demande obtenirDemandeParId(
            @PathVariable Long id
    ) {
        return demandeService.obtenirDemandeParId(id);
    }

    // POST : ajouter une demande
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Demande ajouterDemande(
            @Valid @RequestBody Demande demande
    ) {
        return demandeService.ajouterDemande(demande);
    }

    // PUT : modifier une demande
    @PutMapping("/{id}")
    public Demande modifierDemande(
            @PathVariable Long id,
            @Valid @RequestBody Demande demande
    ) {
        return demandeService.modifierDemande(id, demande);
    }

    // DELETE : supprimer une demande
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void supprimerDemande(
            @PathVariable Long id
    ) {
        demandeService.supprimerDemande(id);
    }
}