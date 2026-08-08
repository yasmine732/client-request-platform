import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import {
  LoginResponse,
} from '../../services/auth.service';

import {
  DemandeService,
} from '../../services/demande.service';

import {
  DemandeRequest,
  Priorite,
} from '../../models/demande.model';

@Component({
  selector: 'app-new-demande',
  imports: [
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './new-demande.html',
  styleUrl: './new-demande.css',
})
export class NewDemande implements OnInit {

  demandeForm: FormGroup;

  user: LoginResponse | null = null;

  submitted = false;
  isLoading = false;

  successMessage = '';
  errorMessage = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly demandeService: DemandeService,
    private readonly router: Router
  ) {
    this.demandeForm = this.formBuilder.group({
      titre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(150),
        ],
      ],

      categorie: [
        '',
        Validators.required,
      ],

      priorite: [
        'MOYENNE',
        Validators.required,
      ],

      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(2000),
        ],
      ],
    });
  }

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

    } catch {

      localStorage.removeItem(
        'clientflow_user'
      );

      this.router.navigate(['/login']);
    }
  }

  get titre() {
    return this.demandeForm.get('titre');
  }

  get categorie() {
    return this.demandeForm.get('categorie');
  }

  get priorite() {
    return this.demandeForm.get('priorite');
  }

  get description() {
    return this.demandeForm.get('description');
  }

  onSubmit(): void {

    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (
      this.demandeForm.invalid ||
      !this.user?.clientId
    ) {
      this.demandeForm.markAllAsTouched();
      return;
    }

    const formValue =
      this.demandeForm.getRawValue();

    const request: DemandeRequest = {

      titre:
        formValue.titre.trim(),

      description:
        formValue.description.trim(),

      categorie:
        formValue.categorie.trim(),

      priorite:
        formValue.priorite as Priorite,

      statut:
        'NOUVELLE',

      client: {
        id: this.user.clientId,
        actif: true,
      },

      agentResponsable: null,
    };

    this.isLoading = true;

    this.demandeService
      .ajouterDemande(request)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({

        next: () => {

          this.successMessage =
            'Votre demande a été créée avec succès.';

          this.demandeForm.reset({
            titre: '',
            categorie: '',
            priorite: 'MOYENNE',
            description: '',
          });

          this.submitted = false;

          setTimeout(() => {
            this.router.navigate([
              '/client/dashboard',
            ]);
          }, 1200);
        },

        error: (
          error: HttpErrorResponse
        ) => {

          if (error.status === 0) {
            this.errorMessage =
              'Impossible de contacter le serveur.';
            return;
          }

          this.errorMessage =
            'Une erreur est survenue pendant la création de la demande.';
        },
      });
  }

  annuler(): void {
    this.router.navigate([
      '/client/dashboard',
    ]);
  }
}