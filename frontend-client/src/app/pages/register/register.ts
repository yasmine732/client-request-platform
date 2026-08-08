import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import {
  AuthService,
  RegisterClientRequest,
  TypeClient,
} from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;

  submitted = false;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  successMessage = '';
  errorMessage = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.registerForm = this.formBuilder.group(
      {
        typeClient: [
          'PARTICULIER',
          Validators.required,
        ],

        nom: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
          ],
        ],

        prenom: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
          ],
        ],

        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.maxLength(150),
          ],
        ],

        telephone: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[0-9+\s]{8,20}$/),
          ],
        ],

        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(100),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/
            ),
          ],
        ],

        confirmPassword: [
          '',
          Validators.required,
        ],

        acceptTerms: [
          false,
          Validators.requiredTrue,
        ],
      },
      {
        validators: this.passwordsMatchValidator,
      }
    );
  }

  get typeClient(): AbstractControl | null {
    return this.registerForm.get('typeClient');
  }

  get nom(): AbstractControl | null {
    return this.registerForm.get('nom');
  }

  get prenom(): AbstractControl | null {
    return this.registerForm.get('prenom');
  }

  get email(): AbstractControl | null {
    return this.registerForm.get('email');
  }

  get telephone(): AbstractControl | null {
    return this.registerForm.get('telephone');
  }

  get password(): AbstractControl | null {
    return this.registerForm.get('password');
  }

  get confirmPassword(): AbstractControl | null {
    return this.registerForm.get('confirmPassword');
  }

  get acceptTerms(): AbstractControl | null {
    return this.registerForm.get('acceptTerms');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword =
      !this.showConfirmPassword;
  }

  passwordsMatchValidator(
    formGroup: AbstractControl
  ): ValidationErrors | null {
    const password =
      formGroup.get('password')?.value;

    const confirmPassword =
      formGroup.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword
      ? null
      : {
          passwordsNotMatching: true,
        };
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue =
      this.registerForm.getRawValue();

    const request: RegisterClientRequest = {
      typeClient:
        formValue.typeClient as TypeClient,

      nom:
        formValue.nom.trim(),

      prenom:
        formValue.prenom.trim(),

      email:
        formValue.email
          .trim()
          .toLowerCase(),

      telephone:
        formValue.telephone.trim(),

      motDePasse:
        formValue.password,
    };

    this.isLoading = true;

    this.authService
      .registerClient(request)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.successMessage =
            response.message ||
            'Votre compte a été créé avec succès.';

          this.registerForm.reset({
            typeClient: 'PARTICULIER',
            acceptTerms: false,
          });

          this.submitted = false;

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },

        error: (error: HttpErrorResponse) => {
          this.errorMessage =
            this.extractErrorMessage(error);
        },
      });
  }

  private extractErrorMessage(
    error: HttpErrorResponse
  ): string {
    if (error.status === 0) {
      return (
        'Impossible de contacter le serveur. ' +
        'Vérifiez que le backend fonctionne sur le port 8081.'
      );
    }

    if (error.status === 409) {
      return (
        'Un compte existe déjà avec cette adresse e-mail.'
      );
    }

    if (
      typeof error.error === 'object' &&
      error.error !== null
    ) {
      return (
        error.error.detail ||
        error.error.message ||
        error.error.error ||
        'Une erreur est survenue pendant la création du compte.'
      );
    }

    return (
      'Une erreur est survenue pendant la création du compte.'
    );
  }
}