export type Priorite =
  | 'BASSE'
  | 'MOYENNE'
  | 'HAUTE'
  | 'URGENTE';

export type StatutDemande =
  | 'NOUVELLE'
  | 'AFFECTEE'
  | 'EN_COURS'
  | 'RESOLUE'
  | 'FERMEE';

export interface ClientResume {
  id: number;
  referenceClient?: string;
  typeClient?: string;
  nom?: string;
  prenom?: string | null;
  raisonSociale?: string | null;
  email?: string;
  telephone?: string;
  adresse?: string;
  actif: boolean;
}

export interface AgentResume {
  id: number;
  nom?: string;
  prenom?: string;
  email?: string;
}

export interface Demande {
  id?: number;
  referenceDemande?: string;
  titre: string;
  description: string;
  categorie: string;
  priorite: Priorite;
  statut: StatutDemande;
  dateCreation?: string;
  dateModification?: string;
  dateCloture?: string | null;
  client: ClientResume;
  agentResponsable?: AgentResume | null;
}

export interface DemandeRequest {
  titre: string;
  description: string;
  categorie: string;
  priorite: Priorite;
  statut: StatutDemande;

  client: {
    id: number;
    actif: boolean;
  };

  agentResponsable: null;
}

export interface DemandeForm {
  titre: string;
  description: string;
  categorie: string;
  priorite: Priorite;
  statut: StatutDemande;
  clientId: number | null;
}