package com.stb.clientrequest.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.stb.clientrequest.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_user_email",
                        columnNames = "email"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    @Size(
            min = 2,
            max = 50,
            message = "Le nom doit contenir entre 2 et 50 caractères"
    )
    @Column(nullable = false, length = 50)
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    @Size(
            min = 2,
            max = 50,
            message = "Le prénom doit contenir entre 2 et 50 caractères"
    )
    @Column(nullable = false, length = 50)
    private String prenom;

    @NotBlank(message = "L’adresse email est obligatoire")
    @Email(message = "L’adresse email n’est pas valide")
    @Column(nullable = false, unique = true, length = 150)
    private String email;

    /*
     * Le mot de passe est obligatoire lors de l'ajout.
     * Lors d'une modification, il peut être absent afin de
     * conserver l'ancien mot de passe.
     */
    @Size(
            min = 8,
            max = 100,
            message = "Le mot de passe doit contenir entre 8 et 100 caractères"
    )
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false, length = 100)
    private String motDePasse;

    @NotNull(message = "Le rôle est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(nullable = false)
    private boolean actif = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    private LocalDateTime dateModification;

    @PrePersist
    public void avantCreation() {
        LocalDateTime maintenant = LocalDateTime.now();

        this.dateCreation = maintenant;
        this.dateModification = maintenant;
    }

    @PreUpdate
    public void avantModification() {
        this.dateModification = LocalDateTime.now();
    }
}