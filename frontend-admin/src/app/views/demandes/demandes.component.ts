import { CommonModule } from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  FormsModule,
  NgForm
} from '@angular/forms';

import { jsPDF } from 'jspdf';
import * as QRCode from 'qrcode';

import {
  ClientResume,
  Demande,
  DemandeForm,
  DemandeRequest,
  Priorite,
  StatutDemande
} from '../../models/demande.model';

import {
  DemandeService
} from '../../services/demande.service';

@Component({
  selector: 'app-demandes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './demandes.component.html',
  styleUrls: ['./demandes.component.scss']
})
export class DemandesComponent implements OnInit {

  demandes: Demande[] = [];
  demandesFiltrees: Demande[] = [];
  clients: ClientResume[] = [];

  recherche = '';
  chargement = false;

  formulaireVisible = false;
  modeModification = false;
  soumissionEffectuee = false;

  demandeSelectionneeId: number | null = null;

  messageSucces = '';
  messageErreur = '';

  /*
   * QR CODE
   */
  qrVisible = false;
  qrChargement = false;

  qrCodeDataUrl = '';
  qrReference = '';
  qrTitre = '';

  priorites: Priorite[] = [
    'BASSE',
    'MOYENNE',
    'HAUTE',
    'URGENTE'
  ];

  statuts: StatutDemande[] = [
    'NOUVELLE',
    'AFFECTEE',
    'EN_COURS',
    'RESOLUE',
    'FERMEE'
  ];

  formulaire: DemandeForm =
    this.creerFormulaireVide();

  constructor(
    private demandeService: DemandeService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerClients();
    this.chargerDemandes();
  }

  /*
   * =====================================================
   * CHARGEMENT
   * =====================================================
   */

  chargerDemandes(): void {

    this.chargement = true;

    this.demandeService
      .getDemandes()
      .subscribe({

        next: (demandes: Demande[]) => {

          this.demandes = demandes;

          this.filtrerDemandes();

          this.chargement = false;

          this.changeDetectorRef.detectChanges();
        },

        error: (erreur: unknown) => {

          console.error(erreur);

          this.messageSucces = '';

          this.messageErreur =
            'Impossible de charger les demandes. Vérifiez que le backend fonctionne.';

          this.chargement = false;

          this.changeDetectorRef.detectChanges();
        }
      });
  }

  chargerClients(): void {

    this.demandeService
      .getClients()
      .subscribe({

        next: (clients: ClientResume[]) => {

          this.clients =
            clients.filter(
              (client: ClientResume) =>
                client.actif
            );

          this.changeDetectorRef.detectChanges();
        },

        error: (erreur: unknown) => {

          console.error(erreur);

          this.messageSucces = '';

          this.messageErreur =
            'Impossible de charger la liste des clients.';

          this.changeDetectorRef.detectChanges();
        }
      });
  }

  /*
   * =====================================================
   * FORMULAIRE
   * =====================================================
   */

  ouvrirAjout(): void {

    this.modeModification = false;
    this.soumissionEffectuee = false;
    this.demandeSelectionneeId = null;

    this.formulaire =
      this.creerFormulaireVide();

    this.formulaireVisible = true;

    this.messageErreur = '';
    this.messageSucces = '';
  }

  ouvrirModification(
    demande: Demande
  ): void {

    if (demande.id === undefined) {
      return;
    }

    this.modeModification = true;
    this.soumissionEffectuee = false;

    this.demandeSelectionneeId =
      demande.id;

    this.formulaire = {

      titre:
        demande.titre,

      description:
        demande.description,

      categorie:
        demande.categorie,

      priorite:
        demande.priorite,

      statut:
        demande.statut,

      clientId:
        demande.client?.id ?? null
    };

    this.formulaireVisible = true;

    this.messageErreur = '';
    this.messageSucces = '';
  }

  fermerFormulaire(): void {
    this.reinitialiserFormulaire();
  }

  private reinitialiserFormulaire(): void {

    this.formulaireVisible = false;

    this.modeModification = false;

    this.soumissionEffectuee = false;

    this.demandeSelectionneeId = null;

    this.formulaire =
      this.creerFormulaireVide();
  }

  effacerMessageErreur(): void {
    this.messageErreur = '';
  }

  enregistrerDemande(
    demandeForm: NgForm
  ): void {

    this.messageErreur = '';
    this.messageSucces = '';
    this.soumissionEffectuee = true;

    demandeForm.form.markAllAsTouched();

    if (this.formulaireInvalide()) {

      this.messageErreur =
        'Veuillez remplir correctement tous les champs obligatoires.';

      return;
    }

    const demandeRequest: DemandeRequest = {

      titre:
        this.formulaire.titre.trim(),

      description:
        this.formulaire.description.trim(),

      categorie:
        this.formulaire.categorie.trim(),

      priorite:
        this.formulaire.priorite,

      statut:
        this.formulaire.statut,

      client: {

        id:
          this.formulaire.clientId as number,

        actif:
          true
      },

      agentResponsable:
        null
    };

    if (
      this.modeModification &&
      this.demandeSelectionneeId !== null
    ) {

      this.modifierDemande(
        this.demandeSelectionneeId,
        demandeRequest
      );

    } else {

      this.ajouterDemande(
        demandeRequest
      );
    }
  }

  ajouterDemande(
    demandeRequest: DemandeRequest
  ): void {

    this.messageErreur = '';
    this.messageSucces = '';

    this.demandeService
      .ajouterDemande(
        demandeRequest
      )
      .subscribe({

        next: () => {

          this.reinitialiserFormulaire();

          this.messageErreur = '';

          this.messageSucces =
            'Demande ajoutée avec succès.';

          this.changeDetectorRef.detectChanges();

          this.chargerDemandes();
        },

        error: (erreur: any) => {

          console.error(erreur);

          this.messageSucces = '';

          this.messageErreur =
            erreur?.error?.message ||
            'Erreur pendant l’ajout de la demande.';

          this.changeDetectorRef.detectChanges();
        }
      });
  }

  modifierDemande(
    id: number,
    demandeRequest: DemandeRequest
  ): void {

    this.messageErreur = '';
    this.messageSucces = '';

    this.demandeService
      .modifierDemande(
        id,
        demandeRequest
      )
      .subscribe({

        next: () => {

          this.reinitialiserFormulaire();

          this.messageErreur = '';

          this.messageSucces =
            'Demande modifiée avec succès.';

          this.changeDetectorRef.detectChanges();

          this.chargerDemandes();
        },

        error: (erreur: any) => {

          console.error(erreur);

          this.messageSucces = '';

          this.messageErreur =
            erreur?.error?.message ||
            'Erreur pendant la modification de la demande.';

          this.changeDetectorRef.detectChanges();
        }
      });
  }

  supprimerDemande(
    demande: Demande
  ): void {

    if (demande.id === undefined) {
      return;
    }

    const confirmation =
      window.confirm(
        `Voulez-vous vraiment supprimer la demande ${
          demande.referenceDemande ||
          demande.titre
        } ?`
      );

    if (!confirmation) {
      return;
    }

    this.messageErreur = '';
    this.messageSucces = '';

    this.demandeService
      .supprimerDemande(
        demande.id
      )
      .subscribe({

        next: () => {

          this.messageErreur = '';

          this.messageSucces =
            'Demande supprimée avec succès.';

          this.changeDetectorRef.detectChanges();

          this.chargerDemandes();
        },

        error: (erreur: any) => {

          console.error(erreur);

          this.messageSucces = '';

          this.messageErreur =
            erreur?.error?.message ||
            'Impossible de supprimer cette demande.';

          this.changeDetectorRef.detectChanges();
        }
      });
  }

  /*
   * =====================================================
   * QR CODE
   * =====================================================
   */

  async ouvrirQrCode(
    demande: Demande
  ): Promise<void> {

    this.qrChargement = true;

    this.messageErreur = '';

    try {

      const reference =
        this.referenceDemande(
          demande
        );

      const contenuQr =
        this.construireContenuQr(
          demande
        );

      this.qrCodeDataUrl =
        await QRCode.toDataURL(
          contenuQr,
          {
            width: 340,
            margin: 2,
            errorCorrectionLevel: 'M'
          }
        );

      this.qrReference =
        reference;

      this.qrTitre =
        demande.titre;

      this.qrVisible =
        true;

      this.changeDetectorRef
        .detectChanges();

    } catch (erreur) {

      console.error(
        'Erreur QR Code :',
        erreur
      );

      this.messageSucces = '';

      this.messageErreur =
        'Impossible de générer le QR Code.';

    } finally {

      this.qrChargement =
        false;

      this.changeDetectorRef
        .detectChanges();
    }
  }

  fermerQrCode(): void {

    this.qrVisible = false;

    this.qrCodeDataUrl = '';

    this.qrReference = '';

    this.qrTitre = '';
  }

  telechargerQrCode(): void {

    if (!this.qrCodeDataUrl) {
      return;
    }

    const lien =
      document.createElement(
        'a'
      );

    const referenceFichier =
      this.qrReference
        .replace(
          /[^a-zA-Z0-9-_]/g,
          '-'
        );

    lien.href =
      this.qrCodeDataUrl;

    lien.download =
      `ClientFlow-QR-${referenceFichier}.png`;

    document.body
      .appendChild(
        lien
      );

    lien.click();

    document.body
      .removeChild(
        lien
      );

    this.messageErreur = '';

    this.messageSucces =
      `QR Code de la demande ${this.qrReference} téléchargé avec succès.`;

    this.changeDetectorRef
      .detectChanges();
  }

  private construireContenuQr(
    demande: Demande
  ): string {

    const reference =
      this.referenceDemande(
        demande
      );

    return [
      'ClientFlow',
      `Référence : ${reference}`,
      `Titre : ${demande.titre}`,
      `Statut : ${this.afficherValeurEnum(demande.statut)}`,
      `Priorité : ${this.afficherValeurEnum(demande.priorite)}`
    ].join('\n');
  }

  /*
   * =====================================================
   * PDF
   * =====================================================
   */

  genererPdf(
    demande: Demande
  ): void {

    try {

      const pdf =
        new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

      const largeurPage =
        pdf.internal.pageSize.getWidth();

      const hauteurPage =
        pdf.internal.pageSize.getHeight();

      const marge = 18;

      const largeurContenu =
        largeurPage -
        marge * 2;

      const reference =
        this.referenceDemande(
          demande
        );

      /*
       * EN-TÊTE
       */

      pdf.setFillColor(
        103,
        65,
        190
      );

      pdf.rect(
        0,
        0,
        largeurPage,
        42,
        'F'
      );

      pdf.setTextColor(
        255,
        255,
        255
      );

      pdf.setFont(
        'helvetica',
        'bold'
      );

      pdf.setFontSize(
        23
      );

      pdf.text(
        'ClientFlow',
        marge,
        17
      );

      pdf.setFont(
        'helvetica',
        'normal'
      );

      pdf.setFontSize(
        10
      );

      pdf.text(
        'Plateforme de suivi des demandes clients',
        marge,
        25
      );

      pdf.setFont(
        'helvetica',
        'bold'
      );

      pdf.setFontSize(
        9
      );

      pdf.text(
        'FICHE DE DEMANDE',
        largeurPage - marge,
        17,
        {
          align: 'right'
        }
      );

      pdf.setFont(
        'helvetica',
        'normal'
      );

      pdf.setFontSize(
        8
      );

      pdf.text(
        reference,
        largeurPage - marge,
        24,
        {
          align: 'right'
        }
      );

      /*
       * TITRE
       */

      pdf.setTextColor(
        30,
        36,
        48
      );

      pdf.setFont(
        'helvetica',
        'bold'
      );

      pdf.setFontSize(
        18
      );

      pdf.text(
        'Détails de la demande',
        marge,
        57
      );

      pdf.setFontSize(
        9
      );

      pdf.setTextColor(
        103,
        65,
        190
      );

      pdf.text(
        reference,
        marge,
        65
      );

      pdf.setDrawColor(
        225,
        228,
        235
      );

      pdf.line(
        marge,
        71,
        largeurPage - marge,
        71
      );

      /*
       * INFORMATIONS
       */

      let y = 83;

      y = this.ajouterChampPdf(
        pdf,
        'Client',
        this.nomClient(
          demande.client
        ),
        y
      );

      y = this.ajouterChampPdf(
        pdf,
        'E-mail',
        demande.client?.email ||
          'Non renseigné',
        y
      );

      y = this.ajouterChampPdf(
        pdf,
        'Catégorie',
        demande.categorie ||
          'Non renseignée',
        y
      );

      y = this.ajouterChampPdf(
        pdf,
        'Priorité',
        this.afficherValeurEnum(
          demande.priorite
        ),
        y
      );

      y = this.ajouterChampPdf(
        pdf,
        'Statut',
        this.afficherValeurEnum(
          demande.statut
        ),
        y
      );

      y = this.ajouterChampPdf(
        pdf,
        'Agent responsable',
        this.nomAgent(
          demande
        ),
        y
      );

      y = this.ajouterChampPdf(
        pdf,
        'Date de création',
        this.formatDatePdf(
          demande.dateCreation
        ),
        y
      );

      /*
       * TITRE DEMANDE
       */

      y += 7;

      pdf.setFillColor(
        247,
        246,
        252
      );

      const lignesTitre =
        pdf.splitTextToSize(
          demande.titre ||
            'Sans titre',
          largeurContenu - 12
        );

      const hauteurTitre =
        Math.max(
          28,
          18 +
          lignesTitre.length * 5
        );

      pdf.roundedRect(
        marge,
        y,
        largeurContenu,
        hauteurTitre,
        3,
        3,
        'F'
      );

      pdf.setTextColor(
        103,
        65,
        190
      );

      pdf.setFont(
        'helvetica',
        'bold'
      );

      pdf.setFontSize(
        8
      );

      pdf.text(
        'TITRE DE LA DEMANDE',
        marge + 6,
        y + 8
      );

      pdf.setTextColor(
        30,
        36,
        48
      );

      pdf.setFontSize(
        11
      );

      pdf.text(
        lignesTitre,
        marge + 6,
        y + 17
      );

      y +=
        hauteurTitre + 13;

      /*
       * DESCRIPTION
       */

      pdf.setTextColor(
        103,
        65,
        190
      );

      pdf.setFont(
        'helvetica',
        'bold'
      );

      pdf.setFontSize(
        9
      );

      pdf.text(
        'DESCRIPTION',
        marge,
        y
      );

      y += 8;

      pdf.setTextColor(
        45,
        51,
        63
      );

      pdf.setFont(
        'helvetica',
        'normal'
      );

      pdf.setFontSize(
        10
      );

      const description =
        demande.description ||
        'Aucune description.';

      const lignesDescription =
        pdf.splitTextToSize(
          description,
          largeurContenu
        );

      const hauteurDescription =
        lignesDescription.length * 5;

      if (
        y +
        hauteurDescription >
        hauteurPage - 28
      ) {

        const premierePartie =
          lignesDescription.slice(
            0,
            20
          );

        const deuxiemePartie =
          lignesDescription.slice(
            20
          );

        pdf.text(
          premierePartie,
          marge,
          y
        );

        if (
          deuxiemePartie.length > 0
        ) {

          pdf.addPage();

          y = 25;

          pdf.setTextColor(
            103,
            65,
            190
          );

          pdf.setFont(
            'helvetica',
            'bold'
          );

          pdf.setFontSize(
            9
          );

          pdf.text(
            'DESCRIPTION - SUITE',
            marge,
            y
          );

          y += 8;

          pdf.setTextColor(
            45,
            51,
            63
          );

          pdf.setFont(
            'helvetica',
            'normal'
          );

          pdf.setFontSize(
            10
          );

          pdf.text(
            deuxiemePartie,
            marge,
            y
          );
        }

      } else {

        pdf.text(
          lignesDescription,
          marge,
          y
        );
      }

      /*
       * PIED DE PAGE
       */

      const nombrePages =
        pdf.getNumberOfPages();

      for (
        let page = 1;
        page <= nombrePages;
        page++
      ) {

        pdf.setPage(
          page
        );

        pdf.setDrawColor(
          225,
          228,
          235
        );

        pdf.line(
          marge,
          hauteurPage - 18,
          largeurPage - marge,
          hauteurPage - 18
        );

        pdf.setTextColor(
          130,
          136,
          148
        );

        pdf.setFont(
          'helvetica',
          'normal'
        );

        pdf.setFontSize(
          8
        );

        pdf.text(
          'Document généré depuis ClientFlow',
          marge,
          hauteurPage - 11
        );

        pdf.text(
          `Page ${page}/${nombrePages}`,
          largeurPage - marge,
          hauteurPage - 11,
          {
            align: 'right'
          }
        );
      }

      const nomFichier =
        reference.replace(
          /[^a-zA-Z0-9-_]/g,
          '-'
        );

      pdf.save(
        `ClientFlow-${nomFichier}.pdf`
      );

      this.messageErreur = '';

      this.messageSucces =
        `PDF de la demande ${reference} généré avec succès.`;

      this.changeDetectorRef
        .detectChanges();

    } catch (erreur) {

      console.error(
        'Erreur génération PDF :',
        erreur
      );

      this.messageSucces = '';

      this.messageErreur =
        'Impossible de générer le PDF.';

      this.changeDetectorRef
        .detectChanges();
    }
  }

  private ajouterChampPdf(
    pdf: jsPDF,
    libelle: string,
    valeur: string,
    y: number
  ): number {

    pdf.setFont(
      'helvetica',
      'bold'
    );

    pdf.setFontSize(
      9
    );

    pdf.setTextColor(
      105,
      112,
      125
    );

    pdf.text(
      `${libelle} :`,
      18,
      y
    );

    pdf.setFont(
      'helvetica',
      'normal'
    );

    pdf.setTextColor(
      35,
      43,
      57
    );

    const lignes =
      pdf.splitTextToSize(
        valeur || '-',
        128
      );

    pdf.text(
      lignes,
      58,
      y
    );

    return (
      y +
      Math.max(
        9,
        lignes.length * 5
      )
    );
  }

  /*
   * =====================================================
   * MÉTHODES COMMUNES PDF / QR
   * =====================================================
   */

  private referenceDemande(
    demande: Demande
  ): string {

    if (
      demande.referenceDemande
    ) {

      return demande
        .referenceDemande;
    }

    if (
      demande.id !== undefined
    ) {

      return `DEM-${demande.id}`;
    }

    return 'DEMANDE';
  }

  private formatDatePdf(
    date?: string
  ): string {

    if (!date) {
      return 'Non renseignée';
    }

    const valeur =
      new Date(date);

    if (
      Number.isNaN(
        valeur.getTime()
      )
    ) {

      return date;
    }

    return valeur
      .toLocaleString(
        'fr-FR',
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }
      );
  }

  /*
   * =====================================================
   * VALIDATION
   * =====================================================
   */

  formulaireInvalide(): boolean {

    return (
      this.formulaire.clientId === null ||
      this.titreVide() ||
      this.titreTropCourt() ||
      this.titreTropLong() ||
      this.categorieVide() ||
      this.categorieTropCourte() ||
      this.categorieTropLongue() ||
      this.descriptionVide() ||
      this.descriptionTropCourte() ||
      this.descriptionTropLongue()
    );
  }

  titreVide(): boolean {

    return (
      this.formulaire.titre
        .trim()
        .length === 0
    );
  }

  titreTropCourt(): boolean {

    const longueur =
      this.formulaire.titre
        .trim()
        .length;

    return (
      longueur > 0 &&
      longueur < 3
    );
  }

  titreTropLong(): boolean {

    return (
      this.formulaire.titre
        .trim()
        .length > 150
    );
  }

  categorieVide(): boolean {

    return (
      this.formulaire.categorie
        .trim()
        .length === 0
    );
  }

  categorieTropCourte(): boolean {

    const longueur =
      this.formulaire.categorie
        .trim()
        .length;

    return (
      longueur > 0 &&
      longueur < 2
    );
  }

  categorieTropLongue(): boolean {

    return (
      this.formulaire.categorie
        .trim()
        .length > 100
    );
  }

  descriptionVide(): boolean {

    return (
      this.formulaire.description
        .trim()
        .length === 0
    );
  }

  descriptionTropCourte(): boolean {

    const longueur =
      this.formulaire.description
        .trim()
        .length;

    return (
      longueur > 0 &&
      longueur < 10
    );
  }

  descriptionTropLongue(): boolean {

    return (
      this.formulaire.description
        .trim()
        .length > 2000
    );
  }

  /*
   * =====================================================
   * RECHERCHE
   * =====================================================
   */

  filtrerDemandes(): void {

    const texte =
      this.recherche
        .trim()
        .toLowerCase();

    if (!texte) {

      this.demandesFiltrees = [
        ...this.demandes
      ];

      return;
    }

    this.demandesFiltrees =
      this.demandes.filter(
        (demande: Demande) => {

          const client =
            this.nomClient(
              demande.client
            ).toLowerCase();

          const reference =
            demande.referenceDemande
              ?.toLowerCase() ||
            '';

          return (
            reference.includes(
              texte
            ) ||

            demande.titre
              .toLowerCase()
              .includes(
                texte
              ) ||

            demande.description
              .toLowerCase()
              .includes(
                texte
              ) ||

            demande.categorie
              .toLowerCase()
              .includes(
                texte
              ) ||

            demande.priorite
              .toLowerCase()
              .includes(
                texte
              ) ||

            demande.statut
              .toLowerCase()
              .includes(
                texte
              ) ||

            client.includes(
              texte
            )
          );
        }
      );
  }

  /*
   * =====================================================
   * AFFICHAGE
   * =====================================================
   */

  nomClient(
    client?: ClientResume
  ): string {

    if (!client) {
      return 'Client inconnu';
    }

    if (
      client.typeClient ===
        'ENTREPRISE' &&
      client.raisonSociale
    ) {

      return client
        .raisonSociale;
    }

    const nomComplet = [
      client.prenom,
      client.nom
    ]
      .filter(Boolean)
      .join(' ');

    return (
      nomComplet ||
      client.email ||
      'Client'
    );
  }

  nomAgent(
    demande: Demande
  ): string {

    const agent =
      demande.agentResponsable;

    if (!agent) {
      return 'Non affecté';
    }

    const nomComplet = [
      agent.prenom,
      agent.nom
    ]
      .filter(Boolean)
      .join(' ');

    return (
      nomComplet ||
      agent.email ||
      'Agent'
    );
  }

  afficherValeurEnum(
    valeur: string
  ): string {

    return valeur
      .replace(
        /_/g,
        ' '
      )
      .toLowerCase()
      .replace(
        /\b\w/g,
        (lettre: string) =>
          lettre.toUpperCase()
      );
  }

  nombreDemandesNouvelles(): number {

    return this.demandes
      .filter(
        (demande: Demande) =>
          demande.statut ===
          'NOUVELLE'
      )
      .length;
  }

  private creerFormulaireVide():
    DemandeForm {

    return {

      titre:
        '',

      description:
        '',

      categorie:
        '',

      priorite:
        'MOYENNE',

      statut:
        'NOUVELLE',

      clientId:
        null
    };
  }
}