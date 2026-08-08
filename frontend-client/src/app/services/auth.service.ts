import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type TypeClient =
  | 'PARTICULIER'
  | 'ENTREPRISE';

export type Role =
  | 'ADMIN'
  | 'AGENT'
  | 'CLIENT';

export interface RegisterClientRequest {
  typeClient: TypeClient;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  motDePasse: string;
}

export interface RegisterClientResponse {
  userId: number;
  clientId: number;
  referenceClient: string;
  email: string;
  role: Role;
  message: string;
}

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface LoginResponse {
  userId: number;
  clientId: number | null;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly apiUrl =
    'http://localhost:8081/api/auth';

  constructor(
    private readonly http: HttpClient
  ) {}

  registerClient(
    request: RegisterClientRequest
  ): Observable<RegisterClientResponse> {

    return this.http.post<RegisterClientResponse>(
      `${this.apiUrl}/register`,
      request
    );
  }

  login(
    request: LoginRequest
  ): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      request
    );
  }
}