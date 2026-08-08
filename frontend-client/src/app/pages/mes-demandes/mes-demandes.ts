import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  Demande,
  StatutDemande,
} from '../../models/demande.model';

import {
  LoginResponse,
} from '../../services/auth.service';

import {
  DemandeService,
} from '../../services/demande.service';

@Component({
  selector: 'app-mes-demandes',
  imports: [
    RouterLink,
    FormsModule,
    DatePipe,
  ],
  templateUrl: './mes-demandes.html',
  styleUrl: './mes-demandes.css',
})
export class MesDemandes implements OnInit {

  user: LoginResponse | null = null;

  demandes: Demande[] = [];
  demandesFiltrees: Demande[] = [];

  isLoading = false;
  errorMessage = '';

  recherche = '';
  filtreStatut = 'TOUS';

  constructor(
    private readonly router: Router,
    private readonly demandeService: DemandeService
  ) {}

  ngOnInit(): void {

    const session =
      localStorage.getItem(
        'clientflow_user'
      );

    if (!session) {
      this.router.navigate(['/login']);
      return;
    }

    try {

      const user: LoginResponse =
        JSON.parse(session);

      if (
        user.role !== 'CLIENT' ||
        !user.clientId
      ) {
        localStorage.removeItem(
          'clientflow_user'
        );

        this.router.navigate(['/login']);
        return;
      }

      this.user = user;

      this.chargerDemandes();

    } catch {

      localStorage.removeItem(
        'clientflow_user'
      );

      this.router.navigate(['/login']);
    }
  }

  chargerDemandes(): void {

    if (!this.user?.clientId) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.demandeService
      .getDemandesClient(
        this.user.clientId
      )
      .subscribe({

        next: (demandes) => {

          this.demandes =
            demandes.sort(
              (a, b) => {

                const dateA =
                  a.dateCreation
                    ? new Date(
                        a.dateCreation
                      ).getTime()
                    : 0;

                const dateB =
                  b.dateCreation
                    ? new Date(
                        b.dateCreation
                      ).getTime()
                    : 0;

                return dateB - dateA;
              }
            );

          this.appliquerFiltres();

          this.isLoading = false;
        },

        error: () => {

          this.errorMessage =
            'Impossible de charger vos demandes.';

          this.isLoading = false;
        },
      });
  }

  appliquerFiltres(): void {

    const recherche =
      this.recherche
        .trim()
        .toLowerCase();

    this.demandesFiltrees =
      this.demandes.filter(
        (demande) => {

          const correspondStatut =
            this.filtreStatut === 'TOUS' ||
            demande.statut ===
              this.filtreStatut;

          const correspondRecherche =
            !recherche ||
            demande.titre
              .toLowerCase()
              .includes(recherche) ||
            demande.description
              .toLowerCase()
              .includes(recherche) ||
            demande.categorie
              .toLowerCase()
              .includes(recherche) ||
            (
              demande.referenceDemande || ''
            )
              .toLowerCase()
              .includes(recherche);

          return (
            correspondStatut &&
            correspondRecherche
          );
        }
      );
  }

  onRechercheChange(): void {
    this.appliquerFiltres();
  }

  onStatutChange(): void {
    this.appliquerFiltres();
  }

  get totalDemandes(): number {
    return this.demandes.length;
  }

  get nouvelles(): number {
    return this.compterStatut(
      'NOUVELLE'
    );
  }

  get enCours(): number {

    return (
      this.compterStatut(
        'AFFECTEE'
      ) +
      this.compterStatut(
        'EN_COURS'
      )
    );
  }

  get resolues(): number {
    return this.compterStatut(
      'RESOLUE'
    );
  }

  private compterStatut(
    statut: StatutDemande
  ): number {

    return this.demandes.filter(
      (demande) =>
        demande.statut === statut
    ).length;
  }

  logout(): void {

    localStorage.removeItem(
      'clientflow_user'
    );

    this.router.navigate(['/login']);
  }
}