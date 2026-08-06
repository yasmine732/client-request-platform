import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  finalize,
  timeout
} from 'rxjs';

import {
  Client,
  TypeClient
} from '../../../models/client.model';

import {
  ClientService
} from '../../../services/client';

@Component({
  selector: 'app-clients',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],

  templateUrl: './clients.html',
  styleUrls: ['./clients.scss']
})
export class Clients implements OnInit {

  private readonly clientService =
    inject(ClientService);

  private readonly formBuilder =
    inject(FormBuilder);

  private readonly changeDetector =
    inject(ChangeDetectorRef);

  clients: Client[] = [];

  clientsAffiches: Client[] = [];

  chargement = false;
  enregistrement = false;

  erreur = '';
  succes = '';

  recherche = '';

  formulaireVisible = false;
  modeEdition = false;

  clientEnModificationId:
    number | undefined;

  formulaire =
    this.formBuilder.group({

      typeClient: [
        'PARTICULIER' as TypeClient,
        Validators.required
      ],

      nom: [''],

      prenom: [''],

      raisonSociale: [''],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      telephone: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?:\+|00)?[0-9][0-9\s().-]{7,19}$/
          )
        ]
      ],

      adresse: [''],

      actif: [true]
    });

  ngOnInit(): void {
    this.chargerClients();
  }

  get typeClientSelectionne(): TypeClient {
    return (
      this.formulaire.controls.typeClient.value
      ?? 'PARTICULIER'
    );
  }

  get nombreClients(): number {
    return this.clients.length;
  }

  get nombreClientsActifs(): number {
    return this.clients.filter(
      (client: Client) =>
        client.actif === true
    ).length;
  }

  get nombreEntreprises(): number {
    return this.clients.filter(
      (client: Client) =>
        client.typeClient === 'ENTREPRISE'
    ).length;
  }

  chargerClients(): void {

    this.chargement = true;
    this.erreur = '';

    this.clientService
      .obtenirTousLesClients()
      .pipe(
        timeout(10000),

        finalize(() => {
          this.chargement = false;

          this.changeDetector
            .detectChanges();
        })
      )
      .subscribe({

        next: (clients: Client[]) => {

          this.clients =
            clients ?? [];

          this.appliquerFiltre();

          this.changeDetector
            .detectChanges();
        },

        error: (
          erreur: HttpErrorResponse | Error
        ) => {

          console.error(
            'Erreur de chargement des clients :',
            erreur
          );

          this.erreur =
            'Impossible de charger les clients. Vérifiez que le backend fonctionne sur le port 8081.';

          this.clients = [];
          this.clientsAffiches = [];

          this.changeDetector
            .detectChanges();
        }
      });
  }

  rechercherClient(
    evenement: Event
  ): void {

    const champ =
      evenement.target as HTMLInputElement;

    this.recherche =
      champ.value ?? '';

    this.appliquerFiltre();

    this.changeDetector
      .detectChanges();
  }

  effacerRecherche(): void {

    this.recherche = '';

    this.appliquerFiltre();

    this.changeDetector
      .detectChanges();
  }

  private appliquerFiltre(): void {

    const texte =
      this.normaliserTexte(
        this.recherche
      );

    if (!texte) {

      this.clientsAffiches =
        [...this.clients];

      return;
    }

    this.clientsAffiches =
      this.clients.filter(
        (client: Client) => {

          const nom =
            this.normaliserTexte(
              client.nom
            );

          const prenom =
            this.normaliserTexte(
              client.prenom
            );

          const nomComplet =
            this.normaliserTexte(
              `${client.prenom ?? ''} ${client.nom ?? ''}`
            );

          const nomInverse =
            this.normaliserTexte(
              `${client.nom ?? ''} ${client.prenom ?? ''}`
            );

          const raisonSociale =
            this.normaliserTexte(
              client.raisonSociale
            );

          const email =
            this.normaliserTexte(
              client.email
            );

          const telephone =
            this.normaliserTexte(
              client.telephone
            );

          const reference =
            this.normaliserTexte(
              client.referenceClient
            );

          const adresse =
            this.normaliserTexte(
              client.adresse
            );

          const typeClient =
            client.typeClient === 'ENTREPRISE'
              ? 'entreprise'
              : client.typeClient === 'PARTICULIER'
                ? 'particulier'
                : '';

          return (
            nom.includes(texte)
            || prenom.includes(texte)
            || nomComplet.includes(texte)
            || nomInverse.includes(texte)
            || raisonSociale.includes(texte)
            || email.includes(texte)
            || telephone.includes(texte)
            || reference.includes(texte)
            || adresse.includes(texte)
            || typeClient.includes(texte)
          );
        }
      );
  }

  private normaliserTexte(
    valeur: string | null | undefined
  ): string {

    return String(
      valeur ?? ''
    )
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      )
      .trim()
      .toLowerCase();
  }

  ouvrirFormulaireAjout(): void {

    this.modeEdition = false;

    this.clientEnModificationId =
      undefined;

    this.formulaire.reset({
      typeClient: 'PARTICULIER',
      nom: '',
      prenom: '',
      raisonSociale: '',
      email: '',
      telephone: '',
      adresse: '',
      actif: true
    });

    this.erreur = '';
    this.succes = '';

    this.formulaireVisible = true;

    this.changeDetector
      .detectChanges();
  }

  ouvrirFormulaireModification(
    client: Client
  ): void {

    this.modeEdition = true;

    this.clientEnModificationId =
      client.id;

    this.formulaire.reset({

      typeClient:
        client.typeClient
        ?? 'PARTICULIER',

      nom:
        client.nom
        ?? '',

      prenom:
        client.prenom
        ?? '',

      raisonSociale:
        client.raisonSociale
        ?? '',

      email:
        client.email
        ?? '',

      telephone:
        client.telephone
        ?? '',

      adresse:
        client.adresse
        ?? '',

      actif:
        client.actif
        ?? true
    });

    this.erreur = '';
    this.succes = '';

    this.formulaireVisible = true;

    this.changeDetector
      .detectChanges();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  fermerFormulaire(): void {

    this.formulaireVisible = false;
    this.modeEdition = false;

    this.clientEnModificationId =
      undefined;

    this.formulaire.reset({
      typeClient: 'PARTICULIER',
      nom: '',
      prenom: '',
      raisonSociale: '',
      email: '',
      telephone: '',
      adresse: '',
      actif: true
    });

    this.erreur = '';

    this.changeDetector
      .detectChanges();
  }

  changerTypeClient(): void {

    if (
      this.typeClientSelectionne
      === 'PARTICULIER'
    ) {

      this.formulaire.controls
        .raisonSociale
        .setValue('');

    } else {

      this.formulaire.controls
        .nom
        .setValue('');

      this.formulaire.controls
        .prenom
        .setValue('');
    }

    this.changeDetector
      .detectChanges();
  }

  enregistrerClient(): void {

    this.erreur = '';
    this.succes = '';

    this.formulaire
      .markAllAsTouched();

    if (this.formulaire.invalid) {

      this.erreur =
        'Veuillez vérifier les champs du formulaire.';

      return;
    }

    const valeurs =
      this.formulaire.getRawValue();

    const typeClient: TypeClient =
      valeurs.typeClient
      ?? 'PARTICULIER';

    if (
      typeClient === 'PARTICULIER'
      &&
      (
        !valeurs.nom?.trim()
        ||
        !valeurs.prenom?.trim()
      )
    ) {

      this.erreur =
        'Le nom et le prénom sont obligatoires pour un particulier.';

      return;
    }

    if (
      typeClient === 'ENTREPRISE'
      &&
      !valeurs.raisonSociale?.trim()
    ) {

      this.erreur =
        'La raison sociale est obligatoire pour une entreprise.';

      return;
    }

    const client: Client = {

      typeClient,

      nom:
        typeClient === 'PARTICULIER'
          ? valeurs.nom?.trim() ?? ''
          : null,

      prenom:
        typeClient === 'PARTICULIER'
          ? valeurs.prenom?.trim() ?? ''
          : null,

      raisonSociale:
        typeClient === 'ENTREPRISE'
          ? valeurs.raisonSociale
              ?.trim() ?? ''
          : null,

      email:
        valeurs.email
          ?.trim()
          .toLowerCase()
        ?? '',

      telephone:
        valeurs.telephone
          ?.trim()
        ?? '',

      adresse:
        valeurs.adresse
          ?.trim()
        ?? '',

      actif:
        valeurs.actif
        ?? true
    };

    this.enregistrement = true;

    this.changeDetector
      .detectChanges();

    if (
      this.modeEdition
      &&
      this.clientEnModificationId
      !== undefined
    ) {

      this.modifierClient(
        this.clientEnModificationId,
        client
      );

    } else {

      this.ajouterClient(client);
    }
  }

  private ajouterClient(
    client: Client
  ): void {

    this.clientService
      .ajouterClient(client)
      .pipe(
        timeout(10000),

        finalize(() => {

          this.enregistrement = false;

          this.changeDetector
            .detectChanges();
        })
      )
      .subscribe({

        next: () => {

          this.succes =
            'Client ajouté avec succès.';

          this.formulaireVisible = false;

          this.chargerClients();
        },

        error: (
          erreur: HttpErrorResponse | Error
        ) => {

          console.error(
            'Erreur lors de l’ajout :',
            erreur
          );

          this.erreur =
            'Impossible d’ajouter le client. Vérifiez les informations saisies et l’adresse email.';

          this.changeDetector
            .detectChanges();
        }
      });
  }

  private modifierClient(
    id: number,
    client: Client
  ): void {

    this.clientService
      .modifierClient(
        id,
        client
      )
      .pipe(
        timeout(10000),

        finalize(() => {

          this.enregistrement = false;

          this.changeDetector
            .detectChanges();
        })
      )
      .subscribe({

        next: () => {

          this.succes =
            'Client modifié avec succès.';

          this.formulaireVisible = false;

          this.chargerClients();
        },

        error: (
          erreur: HttpErrorResponse | Error
        ) => {

          console.error(
            'Erreur lors de la modification :',
            erreur
          );

          this.erreur =
            'Impossible de modifier le client.';

          this.changeDetector
            .detectChanges();
        }
      });
  }

  changerEtat(
    client: Client
  ): void {

    if (client.id === undefined) {
      return;
    }

    this.erreur = '';
    this.succes = '';

    this.clientService
      .modifierEtat(
        client.id,
        !client.actif
      )
      .pipe(
        timeout(10000)
      )
      .subscribe({

        next: () => {

          this.succes =
            client.actif
              ? 'Client désactivé avec succès.'
              : 'Client activé avec succès.';

          this.chargerClients();
        },

        error: (
          erreur: HttpErrorResponse | Error
        ) => {

          console.error(
            'Erreur de changement d’état :',
            erreur
          );

          this.erreur =
            'Impossible de modifier l’état du client.';

          this.changeDetector
            .detectChanges();
        }
      });
  }

  supprimerClient(
    client: Client
  ): void {

    if (client.id === undefined) {
      return;
    }

    const confirmation =
      window.confirm(
        `Voulez-vous vraiment supprimer ${this.obtenirNomClient(client)} ?`
      );

    if (!confirmation) {
      return;
    }

    this.erreur = '';
    this.succes = '';

    this.clientService
      .supprimerClient(client.id)
      .pipe(
        timeout(10000)
      )
      .subscribe({

        next: () => {

          this.succes =
            'Client supprimé avec succès.';

          this.chargerClients();
        },

        error: (
          erreur: HttpErrorResponse | Error
        ) => {

          console.error(
            'Erreur de suppression :',
            erreur
          );

          this.erreur =
            'Suppression impossible. Ce client peut être lié à une demande.';

          this.changeDetector
            .detectChanges();
        }
      });
  }

  obtenirNomClient(
    client: Client
  ): string {

    if (
      client.typeClient
      === 'ENTREPRISE'
    ) {

      return (
        client.raisonSociale
        || 'Entreprise'
      );
    }

    const nomComplet =
      `${client.prenom ?? ''} ${client.nom ?? ''}`
        .trim();

    return (
      nomComplet
      || client.raisonSociale
      || 'Client'
    );
  }

  obtenirInitiales(
    client: Client
  ): string {

    if (
      client.typeClient
      === 'ENTREPRISE'
    ) {

      return (
        client.raisonSociale
        ?? 'EN'
      )
        .substring(0, 2)
        .toUpperCase();
    }

    const initialePrenom =
      client.prenom
        ?.trim()
        .charAt(0)
      ?? '';

    const initialeNom =
      client.nom
        ?.trim()
        .charAt(0)
      ?? '';

    return (
      `${initialePrenom}${initialeNom}`
        .toUpperCase()
      || 'CL'
    );
  }
}