import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Client, ClientService } from '../../services/client.service';

@Component({
  selector: 'app-clients',
  imports: [CommonModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit {

  private readonly clientService = inject(ClientService);

  clients: Client[] = [];
  chargement = true;
  messageErreur = '';

  ngOnInit(): void {
    this.chargerClients();
  }

  chargerClients(): void {
    this.chargement = true;
    this.messageErreur = '';

    this.clientService.obtenirTousLesClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.chargement = false;
      },
      error: (erreur) => {
        console.error(erreur);
        this.messageErreur =
          'Impossible de récupérer les clients depuis le backend.';
        this.chargement = false;
      }
    });
  }
}
