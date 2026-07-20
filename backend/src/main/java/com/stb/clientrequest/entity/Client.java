package com.stb.clientrequest.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

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

    @NotBlank(message = "Le nom est obligatoire")
    @Size(
            min = 2,
            max = 50,
            message = "Le nom doit contenir entre 2 et 50 caractères"
    )
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    @Size(
            min = 2,
            max = 50,
            message = "Le prénom doit contenir entre 2 et 50 caractères"
    )
    private String prenom;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'adresse email n'est pas valide")
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "Le téléphone est obligatoire")
    @Pattern(
            regexp = "^[0-9]{8,15}$",
            message = "Le téléphone doit contenir entre 8 et 15 chiffres"
    )
    private String telephone;

    @NotBlank(message = "L'adresse est obligatoire")
    @Size(
            min = 3,
            max = 200,
            message = "L'adresse doit contenir entre 3 et 200 caractères"
    )
    private String adresse;

    private LocalDateTime dateCreation;

    @PrePersist
    public void avantEnregistrement() {
        this.dateCreation = LocalDateTime.now();
    }
}