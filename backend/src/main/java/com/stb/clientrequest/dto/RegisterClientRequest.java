package com.stb.clientrequest.dto;

import com.stb.clientrequest.enums.TypeClient;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterClientRequest(

        @NotNull(message = "Le type de client est obligatoire")
        TypeClient typeClient,

        @NotBlank(message = "Le nom est obligatoire")
        @Size(
                min = 2,
                max = 50,
                message = "Le nom doit contenir entre 2 et 50 caractères"
        )
        String nom,

        @NotBlank(message = "Le prénom est obligatoire")
        @Size(
                min = 2,
                max = 50,
                message = "Le prénom doit contenir entre 2 et 50 caractères"
        )
        String prenom,

        @NotBlank(message = "L'adresse e-mail est obligatoire")
        @Email(message = "L'adresse e-mail n'est pas valide")
        @Size(
                max = 150,
                message = "L'adresse e-mail est trop longue"
        )
        String email,

        @NotBlank(message = "Le numéro de téléphone est obligatoire")
        @Size(
                max = 30,
                message = "Le numéro de téléphone est trop long"
        )
        String telephone,

        @NotBlank(message = "Le mot de passe est obligatoire")
        @Size(
                min = 8,
                max = 100,
                message = "Le mot de passe doit contenir entre 8 et 100 caractères"
        )
        String motDePasse

) {
}