export type TypeClient =
  | 'PARTICULIER'
  | 'ENTREPRISE';

export interface Client {
  id?: number;
  referenceClient?: string;
  typeClient: TypeClient;

  nom?: string | null;
  prenom?: string | null;
  raisonSociale?: string | null;

  email: string;
  telephone: string;
  adresse?: string | null;

  actif: boolean;

  dateCreation?: string;
  dateModification?: string | null;
}