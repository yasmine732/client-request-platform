import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import {
  Injectable,
  inject
} from '@angular/core';

import {
  Observable
} from 'rxjs';

import {
  Client
} from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8081/api/clients';

  obtenirTousLesClients():
    Observable<Client[]> {

    return this.http.get<Client[]>(
      this.apiUrl
    );
  }

  obtenirClientParId(
    id: number
  ): Observable<Client> {

    return this.http.get<Client>(
      `${this.apiUrl}/${id}`
    );
  }

  rechercherClients(
    texte: string
  ): Observable<Client[]> {

    const params =
      new HttpParams()
        .set('texte', texte);

    return this.http.get<Client[]>(
      `${this.apiUrl}/recherche`,
      { params }
    );
  }

  ajouterClient(
    client: Client
  ): Observable<Client> {

    return this.http.post<Client>(
      this.apiUrl,
      client
    );
  }

  modifierClient(
    id: number,
    client: Client
  ): Observable<Client> {

    return this.http.put<Client>(
      `${this.apiUrl}/${id}`,
      client
    );
  }

  modifierEtat(
    id: number,
    actif: boolean
  ): Observable<Client> {

    const params =
      new HttpParams()
        .set('actif', actif);

    return this.http.patch<Client>(
      `${this.apiUrl}/${id}/etat`,
      null,
      { params }
    );
  }

  supprimerClient(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
