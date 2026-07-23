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
  Role,
  User
} from '../../../models/user.model';

import {
  UserService
} from '../../../services/user';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './users.html',
  styleUrls: ['./users.scss']
})
export class Users implements OnInit {

  private readonly userService =
    inject(UserService);

  private readonly formBuilder =
    inject(FormBuilder);

  private readonly changeDetector =
    inject(ChangeDetectorRef);

  utilisateurs: User[] = [];

  chargement = false;
  enregistrement = false;

  erreur = '';
  succes = '';
  recherche = '';

  formulaireVisible = false;
  modeEdition = false;

  utilisateurEnModificationId:
    number | undefined;

  formulaire =
    this.formBuilder.group({
      nom: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]
      ],

      prenom: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      motDePasse: [''],

      role: [
        'AGENT' as Role,
        Validators.required
      ],

      actif: [true]
    });

  ngOnInit(): void {
    this.chargerUtilisateurs();
  }

  get utilisateursFiltres(): User[] {
    const texte =
      this.recherche
        .trim()
        .toLowerCase();

    if (!texte) {
      return this.utilisateurs;
    }

    return this.utilisateurs.filter(
      (utilisateur: User) =>
        utilisateur.nom
          .toLowerCase()
          .includes(texte)
        ||
        utilisateur.prenom
          .toLowerCase()
          .includes(texte)
        ||
        utilisateur.email
          .toLowerCase()
          .includes(texte)
        ||
        utilisateur.role
          .toLowerCase()
          .includes(texte)
    );
  }

  get nombreUtilisateurs(): number {
    return this.utilisateurs.length;
  }

  get nombreUtilisateursActifs(): number {
    return this.utilisateurs.filter(
      (utilisateur: User) =>
        utilisateur.actif
    ).length;
  }

  get nombreAgents(): number {
    return this.utilisateurs.filter(
      (utilisateur: User) =>
        utilisateur.role === 'AGENT'
    ).length;
  }

  chargerUtilisateurs(): void {
    this.chargement = true;
    this.erreur = '';

    this.changeDetector.detectChanges();

    this.userService
      .obtenirTousLesUtilisateurs()
      .pipe(
        timeout(10000),

        finalize(() => {
          this.chargement = false;
          this.changeDetector.detectChanges();
        })
      )
      .subscribe({
        next: (utilisateurs: User[]) => {
          console.log(
            'Utilisateurs reçus :',
            utilisateurs
          );

          this.utilisateurs =
            utilisateurs ?? [];

          this.changeDetector.detectChanges();
        },

        error: (
          erreur: HttpErrorResponse | Error
        ) => {
          console.error(
            'Erreur lors du chargement :',
            erreur
          );

          this.erreur =
            'Impossible de charger les utilisateurs. Vérifiez la console du navigateur.';

          this.changeDetector.detectChanges();
        }
      });
  }

  ouvrirFormulaireAjout(): void {
    this.modeEdition = false;

    this.utilisateurEnModificationId =
      undefined;

    this.formulaire.reset({
      nom: '',
      prenom: '',
      email: '',
      motDePasse: '',
      role: 'AGENT',
      actif: true
    });

    this.erreur = '';
    this.succes = '';
    this.formulaireVisible = true;

    this.changeDetector.detectChanges();
  }

  ouvrirFormulaireModification(
    utilisateur: User
  ): void {
    this.modeEdition = true;

    this.utilisateurEnModificationId =
      utilisateur.id;

    this.formulaire.reset({
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      email: utilisateur.email,
      motDePasse: '',
      role: utilisateur.role,
      actif: utilisateur.actif
    });

    this.erreur = '';
    this.succes = '';
    this.formulaireVisible = true;

    this.changeDetector.detectChanges();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  fermerFormulaire(): void {
    this.formulaireVisible = false;
    this.modeEdition = false;

    this.utilisateurEnModificationId =
      undefined;

    this.formulaire.reset({
      nom: '',
      prenom: '',
      email: '',
      motDePasse: '',
      role: 'AGENT',
      actif: true
    });

    this.changeDetector.detectChanges();
  }

  enregistrerUtilisateur(): void {
    this.erreur = '';
    this.succes = '';

    this.formulaire.markAllAsTouched();

    if (this.formulaire.invalid) {
      this.erreur =
        'Veuillez vérifier les champs du formulaire.';

      return;
    }

    const valeurs =
      this.formulaire.getRawValue();

    const motDePasse =
      valeurs.motDePasse?.trim() ?? '';

    if (
      !this.modeEdition
      &&
      motDePasse.length < 8
    ) {
      this.erreur =
        'Le mot de passe doit contenir au moins 8 caractères.';

      return;
    }

    if (
      this.modeEdition
      &&
      motDePasse.length > 0
      &&
      motDePasse.length < 8
    ) {
      this.erreur =
        'Le nouveau mot de passe doit contenir au moins 8 caractères.';

      return;
    }

    const utilisateur: User = {
      nom: valeurs.nom ?? '',
      prenom: valeurs.prenom ?? '',
      email: valeurs.email ?? '',
      role: valeurs.role as Role,
      actif: valeurs.actif ?? true
    };

    if (motDePasse) {
      utilisateur.motDePasse =
        motDePasse;
    }

    this.enregistrement = true;
    this.changeDetector.detectChanges();

    if (
      this.modeEdition
      &&
      this.utilisateurEnModificationId
    ) {
      this.modifierUtilisateur(
        this.utilisateurEnModificationId,
        utilisateur
      );
    } else {
      this.ajouterUtilisateur(
        utilisateur
      );
    }
  }

  private ajouterUtilisateur(
    utilisateur: User
  ): void {
    this.userService
      .ajouterUtilisateur(utilisateur)
      .pipe(
        timeout(10000),

        finalize(() => {
          this.enregistrement = false;
          this.changeDetector.detectChanges();
        })
      )
      .subscribe({
        next: () => {
          this.succes =
            'Utilisateur ajouté avec succès.';

          this.formulaireVisible = false;

          this.chargerUtilisateurs();
          this.changeDetector.detectChanges();
        },

        error: (
          erreur: HttpErrorResponse | Error
        ) => {
          console.error(
            'Erreur lors de l’ajout :',
            erreur
          );

          this.erreur =
            'Impossible d’ajouter l’utilisateur. Vérifiez que l’email n’existe pas déjà.';

          this.changeDetector.detectChanges();
        }
      });
  }

  private modifierUtilisateur(
    id: number,
    utilisateur: User
  ): void {
    this.userService
      .modifierUtilisateur(
        id,
        utilisateur
      )
      .pipe(
        timeout(10000),

        finalize(() => {
          this.enregistrement = false;
          this.changeDetector.detectChanges();
        })
      )
      .subscribe({
        next: () => {
          this.succes =
            'Utilisateur modifié avec succès.';

          this.formulaireVisible = false;

          this.chargerUtilisateurs();
          this.changeDetector.detectChanges();
        },

        error: (
          erreur: HttpErrorResponse | Error
        ) => {
          console.error(
            'Erreur lors de la modification :',
            erreur
          );

          this.erreur =
            'Impossible de modifier cet utilisateur.';

          this.changeDetector.detectChanges();
        }
      });
  }

  changerEtat(
    utilisateur: User
  ): void {
    if (!utilisateur.id) {
      return;
    }

    const utilisateurModifie: User = {
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      email: utilisateur.email,
      role: utilisateur.role,
      actif: !utilisateur.actif
    };

    this.erreur = '';
    this.succes = '';

    this.userService
      .modifierUtilisateur(
        utilisateur.id,
        utilisateurModifie
      )
      .pipe(
        timeout(10000)
      )
      .subscribe({
        next: () => {
          this.succes =
            utilisateur.actif
              ? 'Compte désactivé avec succès.'
              : 'Compte activé avec succès.';

          this.chargerUtilisateurs();
          this.changeDetector.detectChanges();
        },

        error: (
          erreur: HttpErrorResponse | Error
        ) => {
          console.error(
            'Erreur changement état :',
            erreur
          );

          this.erreur =
            'Impossible de modifier l’état du compte.';

          this.changeDetector.detectChanges();
        }
      });
  }

  supprimerUtilisateur(
    utilisateur: User
  ): void {
    if (!utilisateur.id) {
      return;
    }

    const confirmation =
      window.confirm(
        `Voulez-vous supprimer ${utilisateur.prenom} ${utilisateur.nom} ?`
      );

    if (!confirmation) {
      return;
    }

    this.erreur = '';
    this.succes = '';

    this.userService
      .supprimerUtilisateur(
        utilisateur.id
      )
      .pipe(
        timeout(10000)
      )
      .subscribe({
        next: () => {
          this.succes =
            'Utilisateur supprimé avec succès.';

          this.chargerUtilisateurs();
          this.changeDetector.detectChanges();
        },

        error: (
          erreur: HttpErrorResponse | Error
        ) => {
          console.error(
            'Erreur lors de la suppression :',
            erreur
          );

          this.erreur =
            'Suppression impossible. Cet utilisateur peut être lié à une demande.';

          this.changeDetector.detectChanges();
        }
      });
  }

  obtenirInitiales(
    utilisateur: User
  ): string {
    return (
      utilisateur.prenom.charAt(0)
      +
      utilisateur.nom.charAt(0)
    ).toUpperCase();
  }
}