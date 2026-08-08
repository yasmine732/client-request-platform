import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import {
  AuthService,
  LoginRequest,
} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginForm: FormGroup;

  submitted = false;
  showPassword = false;
  isLoading = false;

  successMessage = '';
  errorMessage = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.loginForm = this.formBuilder.group({
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
          Validators.minLength(6),
        ],
      ],

      rememberMe: [false],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {

    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const formValue =
      this.loginForm.getRawValue();

    const request: LoginRequest = {
      email: formValue.email
        .trim()
        .toLowerCase(),

      motDePasse: formValue.password,
    };

    this.isLoading = true;

    this.authService
      .login(request)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({

        next: (response) => {

          if (response.role === 'CLIENT') {

            localStorage.setItem(
              'clientflow_user',
              JSON.stringify(response)
            );

            this.successMessage =
              'Connexion réussie.';

            setTimeout(() => {
              this.router.navigate([
                '/client/dashboard',
              ]);
            }, 800);

            return;
          }

          this.errorMessage =
            'Ce compte doit utiliser l’espace administration.';
        },

        error: (error: HttpErrorResponse) => {

          if (error.status === 0) {
            this.errorMessage =
              'Impossible de contacter le serveur.';
            return;
          }

          if (error.status === 401) {
            this.errorMessage =
              'Adresse e-mail ou mot de passe incorrect.';
            return;
          }

          if (error.status === 403) {
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