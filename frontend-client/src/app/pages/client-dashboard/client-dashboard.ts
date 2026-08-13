import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

import {
  Router,
  RouterLink,
} from '@angular/router';

import {
  LoginResponse,
} from '../../services/auth.service';

import {
  DemandeService,
} from '../../services/demande.service';

import {
  Demande,
} from '../../models/demande.model';

@Component({
  selector: 'app-client-dashboard',
  imports: [
    RouterLink,
  ],
  templateUrl: './client-dashboard.html',
  styleUrl: './client-dashboard.css',
})
export class ClientDashboard implements OnInit {

  user: LoginResponse | null = null;

  demandes: Demande[] = [];
  dernieresDemandes: Demande[] = [];

  totalDemandes = 0;
  demandesEnCours = 0;
  demandesResolues = 0;

  isLoading = false;
  errorMessage = '';

  constructor(
    private readonly router: Router,
    private readonly demandeService: DemandeService,
    private readonly cdr: ChangeDetectorRef
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

    const clientId =
      Number(this.user.clientId);

    this.demandeService
      .getDemandesClient(clientId)
      .subscribe({

        next: (demandes) => {

          console.log(
            'Demandes client reçues :',
            demandes
          );

          this.demandes =
            [...demandes].sort(
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

          this.totalDemandes =
            this.demandes.length;

          this.demandesEnCours =
            this.demandes.filter(
              (demande) =>
                demande.statut === 'AFFECTEE' ||
                demande.statut === 'EN_COURS'
            ).length;

          this.demandesResolues =
            this.demandes.filter(
              (demande) =>
                demande.statut === 'RESOLUE'
            ).length;

          this.dernieresDemandes =
            this.demandes.slice(0, 5);

          this.isLoading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Erreur chargement demandes client :',
            error
          );

          this.errorMessage =
            'Impossible de charger vos demandes.';

          this.demandes = [];
          this.dernieresDemandes = [];

          this.totalDemandes = 0;
          this.demandesEnCours = 0;
          this.demandesResolues = 0;

          this.isLoading = false;

          this.cdr.detectChanges();
        },
      });
  }

  get initiales(): string {

    if (!this.user) {
      return 'CL';
    }

    const prenom =
      this.user.prenom?.charAt(0) || '';

    const nom =
      this.user.nom?.charAt(0) || '';

    return `${prenom}${nom}`
      .toUpperCase();
  }

  logout(): void {

    localStorage.removeItem(
      'clientflow_user'
    );

    this.router.navigate(['/login']);
  }
}