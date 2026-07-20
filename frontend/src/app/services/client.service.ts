import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Client {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  dateCreation?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8081/api/clients';

  // Afficher tous les clients
  obtenirTousLesClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  // Afficher un client par son identifiant
  obtenirClientParId(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  // Ajouter un client
  ajouterClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  // Modifier un client
  modifierClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client);
  }

  // Supprimer un client
  supprimerClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}