import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import {
  Demande,
  DemandeRequest,
} from '../models/demande.model';

@Injectable({
  providedIn: 'root',
})
export class DemandeService {

  private readonly apiUrl =
    'http://localhost:8081/api/demandes';

  constructor(
    private readonly http: HttpClient
  ) {}

  ajouterDemande(
    demande: DemandeRequest
  ): Observable<Demande> {

    return this.http.post<Demande>(
      this.apiUrl,
      demande
    );
  }

  getDemandes(): Observable<Demande[]> {

    return this.http.get<Demande[]>(
      this.apiUrl
    );
  }

  getDemandesClient(
    clientId: number
  ): Observable<Demande[]> {

    return this.getDemandes().pipe(
      map((demandes) =>
        demandes.filter(
          (demande) =>
            demande.client?.id === clientId
        )
      )
    );
  }
}