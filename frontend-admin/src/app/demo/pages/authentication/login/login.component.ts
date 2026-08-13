import {
  HttpErrorResponse,
} from '@angular/common/http';

import {
  Component,
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  Router,
} from '@angular/router';

import {
  finalize,
} from 'rxjs';

import {
  AdminAuthService,
  LoginRequest,
} from '../../../../services/admin-auth.service';

@Component({
  selector: 'app-login',

  imports: [
    ReactiveFormsModule,
  ],

  templateUrl:
    './login.component.html',

  styleUrl:
    './login.component.scss',
})
export class LoginComponent {

  loginForm: FormGroup;

  submitted = false;

  isLoading = false;

  errorMessage = '';

  successMessage = '';

  showPassword = false;

  constructor(
    private readonly formBuilder:
      FormBuilder,

    private readonly authService:
      AdminAuthService,

    private readonly router:
      Router
  ) {

    this.loginForm =
      this.formBuilder.group({

        email: [
          '',
          [
            Validators.required,
            Validators.email,
          ],
        ],

        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
          ],
        ],

        rememberMe: [
          true,
        ],
      });
  }

  get email() {

    return this.loginForm.get(
      'email'
    );
  }

  get password() {

    return this.loginForm.get(
      'password'
    );
  }

  togglePassword(): void {

    this.showPassword =
      !this.showPassword;
  }

  onSubmit(): void {

    this.submitted = true;

    this.errorMessage = '';

    this.successMessage = '';

    if (
      this.loginForm.invalid
    ) {

      this.loginForm
        .markAllAsTouched();

      return;
    }

    const formValue =
      this.loginForm
        .getRawValue();

    const request:
      LoginRequest = {

      email:
        formValue.email
          .trim()
          .toLowerCase(),

      motDePasse:
        formValue.password,
    };

    this.isLoading = true;

    this.authService
      .login(request)
      .pipe(
        finalize(() => {

          this.isLoading =
            false;
        })
      )
      .subscribe({

        next: (response) => {

          if (
            response.role ===
              'ADMIN' ||
            response.role ===
              'AGENT'
          ) {

            this.successMessage =
              'Connexion réussie.';

            setTimeout(
              () => {

                this.router
                  .navigate(
                    ['/default']
                  );

              },
              400
            );

            return;
          }

          if (
            response.role ===
            'CLIENT'
          ) {

            this.errorMessage =
              'Ce compte appartient à un client.';

            setTimeout(
              () => {

                window.location.href =
                  'http://localhost:4201/login';

              },
              1000
            );

            return;
          }

          this.errorMessage =
            'Accès non autorisé.';
        },

        error: (
          error:
            HttpErrorResponse
        ) => {

          if (
            error.status === 0
          ) {

            this.errorMessage =
              'Impossible de contacter le serveur.';

            return;
          }

          if (
            error.status === 401
          ) {

            this.errorMessage =
              'Adresse e-mail ou mot de passe incorrect.';

            return;
          }

          if (
            error.status === 403
          ) {

            this.errorMessage =
              'Ce compte est désactivé.';

            return;
          }

          this.errorMessage =
            'Une erreur est survenue lors de la connexion.';
        },
      });
  }
}