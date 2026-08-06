import { CommonModule } from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  FormsModule,
  NgForm
} from '@angular/forms';

import {
  ClientResume,
  Demande,
  DemandeForm,
  DemandeRequest,
  Priorite,
  StatutDemande
} from '../../models/demande.model';

import {
  DemandeService
} from '../../services/demande.service';

@Component({
  selector: 'app-demandes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './demandes.component.html',
  styleUrls: ['./demandes.component.scss']
})
export class DemandesComponent implements OnInit {

  demandes: Demande[] = [];
  demandesFiltrees: Demande[] = [];
  clients: ClientResume[] = [];

  recherche = '';
  chargement = false;

  formulaireVisible = false;
  modeModification = false;
  soumissionEffectuee = false;

  demandeSelectionneeId: number | null = null;

  messageSucces = '';
  messageErreur = '';

  priorites: Priorite[] = [
    'BASSE',
    'MOYENNE',
    'HAUTE',
    'URGENTE'
  ];

  statuts: StatutDemande[] = [
    'NOUVELLE',
    'AFFECTEE',
    'EN_COURS',
    'RESOLUE',
    'FERMEE'
  ];

  formulaire: DemandeForm =
    this.creerFormulaireVide();

  constructor(
    private demandeService: DemandeService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerClients();
    this.chargerDemandes();
  }

  chargerDemandes(): void {
    this.chargement = true;

    this.demandeService
      .getDemandes()
      .subscribe({
        next: (demandes: Demande[]) => {
          this.demandes = demandes;
          this.filtrerDemandes();
          this.chargement = false;

          this.changeDetectorRef.detectChanges();
        },

        error: (erreur: unknown) => {
          console.error(erreur);

          this.messageSucces = '';

          this.messageErreur =
            'Impossible de charger les demandes. Vérifie que le backend fonctionne.';

          this.chargement = false;

          this.changeDetectorRef.detectChanges();
        }
      });
  }

  chargerClients(): void {
    this.demandeService
      .getClients()
      .subscribe({
        next: (clients: ClientResume[]) => {
          this.clients = clients.filter(
            (client: ClientResume) =>
              client.actif
          );

          this.changeDetectorRef.detectChanges();
        },

        error: (erreur: unknown) => {
          console.error(erreur);

          this.messageSucces = '';

          this.messageErreur =
            'Impossible de charger la liste des clients.';

          this.changeDetectorRef.detectChanges();
        }
      });
  }

  ouvrirAjout(): void {
    this.modeModification = false;
    this.soumissionEffectuee = false;
    this.demandeSelectionneeId = null;

    this.formulaire =
      this.creerFormulaireVide();

    this.formulaireVisible = true;

    this.messageErreur = '';
    this.messageSucces = '';
  }

  ouvrirModification(
    demande: Demande
  ): void {
    if (demande.id === undefined) {
      return;
    }

    this.modeModification = true;
    this.soumissionEffectuee = false;

    this.demandeSelectionneeId =
      demande.id;

    this.formulaire = {
      titre: demande.titre,
      description: demande.description,
      categorie: demande.categorie,
      priorite: demande.priorite,
      statut: demande.statut,
      clientId: demande.client?.id ?? null
    };

    this.formulaireVisible = true;

    this.messageErreur = '';
    this.messageSucces = '';
  }

  fermerFormulaire(): void {
    this.reinitialiserFormulaire();
  }

  private reinitialiserFormulaire(): void {
    this.formulaireVisible = false;
    this.modeModification = false;
    this.soumissionEffectuee = false;

    this.demandeSelectionneeId = null;

    this.formulaire =
      this.creerFormulaireVide();
  }

  effacerMessageErreur(): void {
    this.messageErreur = '';
  }

  enregistrerDemande(
    demandeForm: NgForm
  ): void {
    this.messageErreur = '';
    this.messageSucces = '';
    this.soumissionEffectuee = true;

    demandeForm.form.markAllAsTouched();

    if (this.formulaireInvalide()) {
      this.messageErreur =
        'Veuillez remplir correctement tous les champs obligatoires.';

      return;
    }

    const demandeRequest: DemandeRequest = {
      titre:
        this.formulaire.titre.trim(),

      description:
        this.formulaire.description.trim(),

      categorie:
        this.formulaire.categorie.trim(),

      priorite:
        this.formulaire.priorite,

      statut:
        this.formulaire.statut,

      client: {
        id: this.formulaire.clientId as number,
        actif: true
      },

      agentResponsable: null
    };

    if (
      this.modeModification &&
      this.demandeSelectionneeId !== null
    ) {
      this.modifierDemande(
        this.demandeSelectionneeId,
        demandeRequest
      );
    } else {
      this.ajouterDemande(
        demandeRequest
      );
    }
  }

  ajouterDemande(
    demandeRequest: DemandeRequest
  ): void {
    this.messageErreur = '';
    this.messageSucces = '';

    this.demandeService
      .ajouterDemande(demandeRequest)
      .subscribe({
        next: () => {
          this.reinitialiserFormulaire();

          this.messageErreur = '';

          this.messageSucces =
            'Demande ajoutée avec succès.';

          this.changeDetectorRef.detectChanges();

          this.chargerDemandes();
        },

        error: (erreur: any) => {
          console.error(erreur);

          this.messageSucces = '';

          this.messageErreur =
            erreur?.error?.message ||
            'Erreur pendant l’ajout de la demande.';

          this.changeDetectorRef.detectChanges();
        }
      });
  }

  modifierDemande(
    id: number,
    demandeRequest: DemandeRequest
  ): void {
    this.messageErreur = '';
    this.messageSucces = '';

    this.demandeService
      .modifierDemande(
        id,
        demandeRequest
      )
      .subscribe({
        next: () => {
          this.reinitialiserFormulaire();

          this.messageErreur = '';

          this.messageSucces =
            'Demande modifiée avec succès.';

          this.changeDetectorRef.detectChanges();

          this.chargerDemandes();
        },

        error: (erreur: any) => {
          console.error(erreur);

          this.messageSucces = '';

          this.messageErreur =
            erreur?.error?.message ||
            'Erreur pendant la modification de la demande.';

          this.changeDetectorRef.detectChanges();
        }
      });
  }

  supprimerDemande(
    demande: Demande
  ): void {
    if (demande.id === undefined) {
      return;
    }

    const confirmation =
      window.confirm(
        `Voulez-vous vraiment supprimer la demande ${
          demande.referenceDemande ||
          demande.titre
        } ?`
      );

    if (!confirmation) {
      return;
    }

    this.messageErreur = '';
    this.messageSucces = '';

    this.demandeService
      .supprimerDemande(demande.id)
      .subscribe({
        next: () => {
          this.messageErreur = '';

          this.messageSucces =
            'Demande supprimée avec succès.';

          this.changeDetectorRef.detectChanges();

          this.chargerDemandes();
        },

        error: (erreur: any) => {
          console.error(erreur);

          this.messageSucces = '';

          this.messageErreur =
            erreur?.error?.message ||
            'Impossible de supprimer cette demande.';

          this.changeDetectorRef.detectChanges();
        }
      });
  }

  formulaireInvalide(): boolean {
    return (
      this.formulaire.clientId === null ||
      this.titreVide() ||
      this.titreTropCourt() ||
      this.titreTropLong() ||
      this.categorieVide() ||
      this.categorieTropCourte() ||
      this.categorieTropLongue() ||
      this.descriptionVide() ||
      this.descriptionTropCourte() ||
      this.descriptionTropLongue()
    );
  }

  titreVide(): boolean {
    return (
      this.formulaire.titre
        .trim()
        .length === 0
    );
  }

  titreTropCourt(): boolean {
    const longueur =
      this.formulaire.titre
        .trim()
        .length;

    return (
      longueur > 0 &&
      longueur < 3
    );
  }

  titreTropLong(): boolean {
    return (
      this.formulaire.titre
        .trim()
        .length > 150
    );
  }

  categorieVide(): boolean {
    return (
      this.formulaire.categorie
        .trim()
        .length === 0
    );
  }

  categorieTropCourte(): boolean {
    const longueur =
      this.formulaire.categorie
        .trim()
        .length;

    return (
      longueur > 0 &&
      longueur < 2
    );
  }

  categorieTropLongue(): boolean {
    return (
      this.formulaire.categorie
        .trim()
        .length > 100
    );
  }

  descriptionVide(): boolean {
    return (
      this.formulaire.description
        .trim()
        .length === 0
    );
  }

  descriptionTropCourte(): boolean {
    const longueur =
      this.formulaire.description
        .trim()
        .length;

    return (
      longueur > 0 &&
      longueur < 10
    );
  }

  descriptionTropLongue(): boolean {
    return (
      this.formulaire.description
        .trim()
        .length > 2000
    );
  }

  filtrerDemandes(): void {
    const texte =
      this.recherche
        .trim()
        .toLowerCase();

    if (!texte) {
      this.demandesFiltrees = [
        ...this.demandes
      ];

      return;
    }

    this.demandesFiltrees =
      this.demandes.filter(
        (demande: Demande) => {
          const client =
            this.nomClient(
              demande.client
            ).toLowerCase();

          const reference =
            demande.referenceDemande
              ?.toLowerCase() || '';

          return (
            reference.includes(texte) ||

            demande.titre
              .toLowerCase()
              .includes(texte) ||

            demande.description
              .toLowerCase()
              .includes(texte) ||

            demande.categorie
              .toLowerCase()
              .includes(texte) ||

            demande.priorite
              .toLowerCase()
              .includes(texte) ||

            demande.statut
              .toLowerCase()
              .includes(texte) ||

            client.includes(texte)
          );
        }
      );
  }

  nomClient(
    client?: ClientResume
  ): string {
    if (!client) {
      return 'Client inconnu';
    }

    if (
      client.typeClient ===
        'ENTREPRISE' &&
      client.raisonSociale
    ) {
      return client.raisonSociale;
    }

    const nomComplet = [
      client.prenom,
      client.nom
    ]
      .filter(Boolean)
      .join(' ');

    return (
      nomComplet ||
      client.email ||
      'Client'
    );
  }

  nomAgent(
    demande: Demande
  ): string {
    const agent =
      demande.agentResponsable;

    if (!agent) {
      return 'Non affecté';
    }

    const nomComplet = [
      agent.prenom,
      agent.nom
    ]
      .filter(Boolean)
      .join(' ');

    return (
      nomComplet ||
      agent.email ||
      'Agent'
    );
  }

  afficherValeurEnum(
    valeur: string
  ): string {
    return valeur
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(
        /\b\w/g,
        (lettre: string) =>
          lettre.toUpperCase()
      );
  }

  nombreDemandesNouvelles(): number {
    return this.demandes.filter(
      (demande: Demande) =>
        demande.statut === 'NOUVELLE'
    ).length;
  }

  private creerFormulaireVide():
    DemandeForm {
    return {
      titre: '',
      description: '',
      categorie: '',
      priorite: 'MOYENNE',
      statut: 'NOUVELLE',
      clientId: null
    };
  }
}