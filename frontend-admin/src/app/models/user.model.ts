export type Role = 'ADMIN' | 'AGENT';

export interface User {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  motDePasse?: string;
  role: Role;
  actif: boolean;
  dateCreation?: string;
  dateModification?: string | null;
}