package com.stb.clientrequest.entity;

import com.stb.clientrequest.enums.Priorite;
import com.stb.clientrequest.enums.StatutDemande;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "demandes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Demande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le titre est obligatoire")
    @Size(
            min = 3,
            max = 150,
            message = "Le titre doit contenir entre 3 et 150 caractères"
    )
    @Column(nullable = false, length = 150)
    private String titre;

    @NotBlank(message = "La description est obligatoire")
    @Size(
            min = 10,
            max = 2000,
            message = "La description doit contenir entre 10 et 2000 caractères"
    )
    @Column(nullable = false, length = 2000)
    private String description;

    @NotBlank(message = "La catégorie est obligatoire")
    @Size(
            min = 2,
            max = 100,
            message = "La catégorie doit contenir entre 2 et 100 caractères"
    )
    private String categorie;

    @NotNull(message = "La priorité est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priorite priorite;

    @NotNull(message = "Le statut est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutDemande statut;

    private LocalDateTime dateCreation;

    private LocalDateTime dateCloture;

    @NotNull(message = "Le client est obligatoire")
    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne
    @JoinColumn(name = "agent_responsable_id")
    private User agentResponsable;

    @PrePersist
    public void avantEnregistrement() {
        this.dateCreation = LocalDateTime.now();
    }
}
