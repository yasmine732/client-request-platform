package com.stb.clientrequest.entity;

import com.stb.clientrequest.enums.TypeClient;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "clients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "reference_client",
            unique = true,
            length = 30
    )
    private String referenceClient;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_client", length = 20)
    private TypeClient typeClient;

    /*
     * Ces champs sont utilisés pour un particulier.
     */
    @Column(length = 50)
    private String nom;

    @Column(length = 50)
    private String prenom;

    /*
     * Ce champ est utilisé pour une entreprise.
     */
    @Column(
            name = "raison_sociale",
            length = 150
    )
    private String raisonSociale;

    @NotBlank(
            message = "L’adresse email est obligatoire"
    )
    @Email(
            message = "L’adresse email n’est pas valide"
    )
    @Column(
            nullable = false,
            unique = true,
            length = 150
    )
    private String email;

    @NotBlank(
            message = "Le numéro de téléphone est obligatoire"
    )
    @Column(
            nullable = false,
            length = 30
    )
    private String telephone;

    @Column(length = 255)
    private String adresse;

    @Column(nullable = false)
    private boolean actif = true;

    @Column(
            name = "date_creation",
            nullable = false,
            updatable = false
    )
    private LocalDateTime dateCreation;

    @Column(name = "date_modification")
    private LocalDateTime dateModification;

    @PrePersist
    public void avantCreation() {
        LocalDateTime maintenant =
                LocalDateTime.now();

        if (
                referenceClient == null
                || referenceClient.isBlank()
        ) {
            referenceClient =
                    "CLI-"
                    + UUID.randomUUID()
                    .toString()
                    .substring(0, 8)
                    .toUpperCase();
        }

        dateCreation = maintenant;
        dateModification = maintenant;
    }

    @PreUpdate
    public void avantModification() {
        dateModification =
                LocalDateTime.now();
    }
}