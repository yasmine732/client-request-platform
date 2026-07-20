import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Client,
  ClientService
} from '../../services/client.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit {

  private readonly clientService = inject(ClientService);

  clients: Client[] = [];

  chargement = false;
  formulaireVisible = false;

  messageErreur = '';
  messageSucces = '';

  clientEnModificationId: number | null = null;

  clientForm: Client = this.creerClientVide();

  ngOnInit(): void {
    this.chargerClients();
  }

  chargerClients(): void {
    this.chargement = true;
    this.messageErreur = '';

    this.clientService.obtenirTousLesClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.chargement = false;
      },
      error: (erreur) => {
        console.error(erreur);

        this.messageErreur =
          'Impossible de récupérer les clients. Vérifie que le backend est démarré.';

        this.chargement = false;
      }
    });
  }

  ouvrirFormulaireAjout(): void {
    this.clientEnModificationId = null;
    this.clientForm = this.creerClientVide();
    this.formulaireVisible = true;

    this.messageErreur = '';
    this.messageSucces = '';
  }

  ouvrirFormulaireModification(client: Client): void {
    this.clientEnModificationId = client.id ?? null;

    this.clientForm = {
      nom: client.nom,
      prenom: client.prenom,
      email: client.email,
      telephone: client.telephone,
      adresse: client.adresse
    };

    this.formulaireVisible = true;
    this.messageErreur = '';
    this.messageSucces = '';
  }

  fermerFormulaire(): void {
    this.formulaireVisible = false;
    this.clientEnModificationId = null;
    this.clientForm = this.creerClientVide();
  }

  enregistrerClient(): void {
    this.messageErreur = '';
    this.messageSucces = '';

    if (this.clientEnModificationId === null) {
      this.ajouterClient();
    } else {
      this.modifierClient();
    }
  }

  ajouterClient(): void {
    this.clientService.ajouterClient(this.clientForm).subscribe({
      next: () => {
        this.fermerFormulaire();
        this.messageSucces = 'Client ajouté avec succès.';
        this.chargerClients();
      },
      error: (erreur) => {
        console.error(erreur);

        this.messageErreur =
          'Impossible d’ajouter le client. Vérifie les informations saisies.';
      }
    });
  }

  modifierClient(): void {
    if (this.clientEnModificationId === null) {
      return;
    }

    this.clientService
      .modifierClient(
        this.clientEnModificationId,
        this.clientForm
      )
      .subscribe({
        next: () => {
          this.fermerFormulaire();
          this.messageSucces = 'Client modifié avec succès.';
          this.chargerClients();
        },
        error: (erreur) => {
          console.error(erreur);
          this.messageErreur = 'Impossible de modifier le client.';
        }
      });
  }

  supprimerClient(client: Client): void {
    if (client.id === undefined) {
      return;
    }

    const confirmation = window.confirm(
      `Voulez-vous vraiment supprimer ${client.prenom} ${client.nom} ?`
    );

    if (!confirmation) {
      return;
    }

    this.clientService.supprimerClient(client.id).subscribe({
      next: () => {
        this.messageSucces = 'Client supprimé avec succès.';
        this.chargerClients();
      },
      error: (erreur) => {
        console.error(erreur);

        this.messageErreur =
          'Impossible de supprimer ce client. Il peut être lié à une demande.';
      }
    });
  }

  private creerClientVide(): Client {
    return {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      adresse: ''
    };
  }
}