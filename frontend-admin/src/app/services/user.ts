import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8081/api/users';

  obtenirTousLesUtilisateurs(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  obtenirUtilisateurParId(id: number): Observable<User> {
    return this.http.get<User>(
      `${this.apiUrl}/${id}`
    );
  }

  ajouterUtilisateur(user: User): Observable<User> {
    return this.http.post<User>(
      this.apiUrl,
      user
    );
  }

  modifierUtilisateur(
    id: number,
    user: User
  ): Observable<User> {
    return this.http.put<User>(
      `${this.apiUrl}/${id}`,
      user
    );
  }

  supprimerUtilisateur(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}