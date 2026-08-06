import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;

  submitted = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group(
      {
        typeClient: ['PARTICULIER', Validators.required],

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
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  passwordsMatchValidator(
    formGroup: AbstractControl
  ): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword
      ? null
      : { passwordsNotMatching: true };
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const registrationData = {
      ...this.registerForm.value,
      role: 'CLIENT',
    };

    console.log(
      'Informations d’inscription :',
      registrationData
    );

    /*
     * La création réelle du compte CLIENT dans le backend
     * sera ajoutée lors de l'étape d'authentification.
     */
  }
}