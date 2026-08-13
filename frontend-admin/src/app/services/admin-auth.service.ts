import {
  HttpClient,
} from '@angular/common/http';

import {
  Injectable,
} from '@angular/core';

import {
  Observable,
} from 'rxjs';

export type Role =
  | 'ADMIN'
  | 'AGENT'
  | 'CLIENT';

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
export class AdminAuthService {

  private readonly apiUrl =
    'http://localhost:8081/api/auth';

  constructor(
    private readonly http:
      HttpClient
  ) {}

  login(
    request: LoginRequest
  ): Observable<LoginResponse> {

    return this.http.post<
      LoginResponse
    >(
      `${this.apiUrl}/login`,
      request,
      {
        withCredentials: true,
      }
    );
  }

  me():
    Observable<LoginResponse> {

    return this.http.get<
      LoginResponse
    >(
      `${this.apiUrl}/me`,
      {
        withCredentials: true,
      }
    );
  }

  logout():
    Observable<void> {

    return this.http.post<void>(
      `${this.apiUrl}/logout`,
      {},
      {
        withCredentials: true,
      }
    );
  }
}