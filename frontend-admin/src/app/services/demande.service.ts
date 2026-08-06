import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  ClientResume,
  Demande,
  DemandeRequest
} from '../models/demande.model';

@Injectable({
  providedIn: 'root'
})
export class DemandeService {

  private readonly demandesUrl =
    'http://localhost:8081/api/demandes';

  private readonly clientsUrl =
    'http://localhost:8081/api/clients';

  constructor(
    private http: HttpClient
  ) {}

  getDemandes(): Observable<Demande[]> {
    return this.http.get<Demande[]>(
      this.demandesUrl
    );
  }

  getDemandeById(id: number): Observable<Demande> {
    return this.http.get<Demande>(
      `${this.demandesUrl}/${id}`
    );
  }

  ajouterDemande(
    demande: DemandeRequest
  ): Observable<Demande> {
    return this.http.post<Demande>(
      this.demandesUrl,
      demande
    );
  }

  modifierDemande(
    id: number,
    demande: DemandeRequest
  ): Observable<Demande> {
    return this.http.put<Demande>(
      `${this.demandesUrl}/${id}`,
      demande
    );
  }

  supprimerDemande(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.demandesUrl}/${id}`
    );
  }

  getClients(): Observable<ClientResume[]> {
    return this.http.get<ClientResume[]>(
      this.clientsUrl
    );
  }
}