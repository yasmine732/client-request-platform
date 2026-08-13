import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

import {
  HttpClient,
} from '@angular/common/http';

import {
  RouterLink,
} from '@angular/router';

import {
  forkJoin,
} from 'rxjs';

import {
  SHARED_IMPORTS,
} from 'src/app/theme/shared/shared.module';

interface ClientResume {
  id: number;
  referenceClient?: string;
  nom?: string;
  prenom?: string | null;
  raisonSociale?: string | null;
  email?: string;
  actif?: boolean;
}

interface UserResume {
  id: number;
  nom?: string;
  prenom?: string;
  email?: string;
  role?: string;
  actif?: boolean;
}

interface DemandeResume {
  id?: number;
  referenceDemande?: string;
  titre: string;
  description?: string;
  categorie: string;
  priorite: string;
  statut: string;
  dateCreation?: string;

  client?: ClientResume | null;

  agentResponsable?: UserResume | null;
}

@Component({
  selector: 'app-default',

  imports: [
    ...SHARED_IMPORTS,
    RouterLink,
  ],

  templateUrl:
    './default.component.html',

  styleUrl:
    './default.component.scss',
})
export class DefaultComponent
  implements OnInit {

  private readonly usersUrl =
    'http://localhost:8081/api/users';

  private readonly clientsUrl =
    'http://localhost:8081/api/clients';

  private readonly demandesUrl =
    'http://localhost:8081/api/demandes';

  isLoading = true;

  errorMessage = '';

  totalClients = 0;

  totalDemandes = 0;

  demandesNouvelles = 0;

  demandesEnCours = 0;

  demandesResolues = 0;

  demandesFermees = 0;

  agentsActifs = 0;

  tauxResolution = 0;

  dernieresDemandes:
    DemandeResume[] = [];

  constructor(
    private readonly http:
      HttpClient,

    private readonly cd:
      ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.chargerDashboard();
  }

  chargerDashboard(): void {

    this.isLoading = true;

    this.errorMessage = '';

    forkJoin({

      clients:
        this.http.get<
          ClientResume[]
        >(
          this.clientsUrl,
          {
            withCredentials: true,
          }
        ),

      demandes:
        this.http.get<
          DemandeResume[]
        >(
          this.demandesUrl,
          {
            withCredentials: true,
          }
        ),

      users:
        this.http.get<
          UserResume[]
        >(
          this.usersUrl,
          {
            withCredentials: true,
          }
        ),

    }).subscribe({

      next: ({
        clients,
        demandes,
        users,
      }) => {

        this.totalClients =
          clients.length;

        this.totalDemandes =
          demandes.length;

        this.demandesNouvelles =
          demandes.filter(
            (demande) =>
              demande.statut ===
              'NOUVELLE'
          ).length;

        this.demandesEnCours =
          demandes.filter(
            (demande) =>
              demande.statut ===
                'AFFECTEE' ||
              demande.statut ===
                'EN_COURS'
          ).length;

        this.demandesResolues =
          demandes.filter(
            (demande) =>
              demande.statut ===
              'RESOLUE'
          ).length;

        this.demandesFermees =
          demandes.filter(
            (demande) =>
              demande.statut ===
              'FERMEE'
          ).length;

        this.agentsActifs =
          users.filter(
            (user) =>
              user.role === 'AGENT' &&
              user.actif !== false
          ).length;

        if (
          this.totalDemandes > 0
        ) {

          this.tauxResolution =
            Math.round(
              (
                this.demandesResolues /
                this.totalDemandes
              ) * 100
            );

        } else {

          this.tauxResolution = 0;
        }

        this.dernieresDemandes =
          [...demandes]
            .sort(
              (a, b) =>
                this.getTimestamp(
                  b.dateCreation
                ) -
                this.getTimestamp(
                  a.dateCreation
                )
            )
            .slice(
              0,
              6
            );

        this.isLoading = false;

        /*
         * Important avec ce template Angular :
         * forcer la mise à jour de l'interface
         * après les appels HTTP.
         */
        this.cd.detectChanges();
      },

      error: (error) => {

        console.error(
          'Erreur dashboard :',
          error
        );

        this.errorMessage =
          'Impossible de charger les données du tableau de bord.';

        this.isLoading = false;

        this.cd.detectChanges();
      },
    });
  }

  getClientName(
    demande: DemandeResume
  ): string {

    const client =
      demande.client;

    if (!client) {

      return 'Client non renseigné';
    }

    if (
      client.raisonSociale
    ) {

      return client.raisonSociale;
    }

    const prenom =
      client.prenom || '';

    const nom =
      client.nom || '';

    const nomComplet =
      `${prenom} ${nom}`.trim();

    return (
      nomComplet ||
      client.email ||
      'Client'
    );
  }

  getStatutLabel(
    statut: string
  ): string {

    switch (statut) {

      case 'NOUVELLE':

        return 'Nouvelle';

      case 'AFFECTEE':

        return 'Affectée';

      case 'EN_COURS':

        return 'En cours';

      case 'RESOLUE':

        return 'Résolue';

      case 'FERMEE':

        return 'Fermée';

      default:

        return statut;
    }
  }

  getStatutClass(
    statut: string
  ): string {

    switch (statut) {

      case 'NOUVELLE':

        return 'status-new';

      case 'AFFECTEE':

        return 'status-assigned';

      case 'EN_COURS':

        return 'status-progress';

      case 'RESOLUE':

        return 'status-resolved';

      case 'FERMEE':

        return 'status-closed';

      default:

        return 'status-default';
    }
  }

  getPrioriteClass(
    priorite: string
  ): string {

    switch (priorite) {

      case 'URGENTE':

        return 'priority-urgent';

      case 'HAUTE':

        return 'priority-high';

      case 'MOYENNE':

        return 'priority-medium';

      case 'BASSE':

        return 'priority-low';

      default:

        return 'priority-default';
    }
  }

  getPourcentage(
    valeur: number
  ): number {

    if (
      this.totalDemandes === 0
    ) {

      return 0;
    }

    return Math.round(
      (
        valeur /
        this.totalDemandes
      ) * 100
    );
  }

  formatDate(
    date?: string
  ): string {

    if (!date) {

      return '-';
    }

    const valeur =
      new Date(date);

    if (
      Number.isNaN(
        valeur.getTime()
      )
    ) {

      return '-';
    }

    return valeur
      .toLocaleDateString(
        'fr-FR',
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }
      );
  }

  private getTimestamp(
    date?: string
  ): number {

    if (!date) {

      return 0;
    }

    const timestamp =
      new Date(date)
        .getTime();

    return Number.isNaN(
      timestamp
    )
      ? 0
      : timestamp;
  }
}