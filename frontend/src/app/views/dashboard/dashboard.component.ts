import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';

interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
}

interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'ADMIN' | 'AGENT';
  actif: boolean;
}

interface Demande {
  id: number;
  titre: string;
  categorie: string;
  priorite: string;
  statut: string;
  dateCreation?: string;
  client?: Client;
  agentResponsable?: Utilisateur;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  private readonly http = inject(HttpClient);

  chargement = true;

  nombreClients = 0;
  nombreUtilisateurs = 0;
  nombreDemandes = 0;
  demandesOuvertes = 0;

  clientsRecents: Client[] = [];
  demandesRecentes: Demande[] = [];

  ngOnInit(): void {
    this.chargerStatistiques();
  }

  chargerStatistiques(): void {
    this.chargement = true;

    forkJoin({
      clients: this.http
        .get<Client[]>('http://localhost:8081/api/clients')
        .pipe(catchError(() => of([]))),

      utilisateurs: this.http
        .get<Utilisateur[]>('http://localhost:8081/api/users')
        .pipe(catchError(() => of([]))),

      demandes: this.http
        .get<Demande[]>('http://localhost:8081/api/demandes')
        .pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ clients, utilisateurs, demandes }) => {
        this.nombreClients = clients.length;
        this.nombreUtilisateurs = utilisateurs.length;
        this.nombreDemandes = demandes.length;

        this.demandesOuvertes = demandes.filter(
          demande =>
            demande.statut === 'NOUVELLE' ||
            demande.statut === 'EN_COURS'
        ).length;

        this.clientsRecents = [...clients]
          .reverse()
          .slice(0, 4);

        this.demandesRecentes = [...demandes]
          .reverse()
          .slice(0, 4);

        this.chargement = false;
      },
      error: () => {
        this.chargement = false;
      }
    });
  }

  obtenirInitiales(client: Client): string {
    const prenom = client.prenom?.charAt(0) ?? '';
    const nom = client.nom?.charAt(0) ?? '';

    return `${prenom}${nom}`.toUpperCase();
  }

  classeStatut(statut: string): string {
    switch (statut) {
      case 'NOUVELLE':
        return 'statut-nouvelle';

      case 'EN_COURS':
        return 'statut-encours';

      case 'RESOLUE':
        return 'statut-resolue';

      case 'FERMEE':
        return 'statut-fermee';

      default:
        return '';
    }
  }
}
