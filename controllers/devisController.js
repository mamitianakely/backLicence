const { createDevis, getDevis, deleteDevisById, fetchTotalDevisFromDB, getDevisSortedByClientName, fetchDevisWithPermisAndClient,
  getAverageDevis, getMinMaxDevis, updateDevisStateToPaid, createPermis, getDevisById, getDemandsByDevisState } = require('../models/devisModel');
const PDFDocument = require('pdfkit');
const path = require('path');

// créer un Devis
const addDevis = async (req, res) => {
    try {
        //console.log('Données reçues:', req.body); // Ajoute ceci pour voir les données reçues
        const newDevis = await createDevis(req.body);
        res.status(201).json({ numDevis: newDevis });
    } catch (error) {
        console.error('Erreur lors de l\'ajout du devis:', error); // Affiche l'erreur dans la console
        res.status(500).json({ error: error.message });
    }
};

// Récupérer tous les devis
const getAllDevis = async (req, res) => {
    try {
        const devis = await getDevis();
        res.json(devis);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Supprimer un devis
const deleteDevis = async (req, res) => {
    const { numDevis } = req.params;
    try {
      await deleteDevisById(numDevis); // Appel de la fonction dans le modèle
      res.status(204).send(); // Réponse vide indiquant une suppression réussie
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Controller pour mettre à jour l'état d'un devis à "payé"
const markDevisAsPaid = async (req, res) => {
  const { numDevis } = req.params; // numDevis passé en paramètre d'URL

  try {
    const updatedDevis = await updateDevisStateToPaid(numDevis);
    res.status(200).json({
      message: 'Devis mis à jour avec succès',
      data: updatedDevis,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la mise à jour du devis',
      error: error.message,
    });
  }
};

  const getTotalDevis = async (req, res) => {
    try {
        const totalDevis = await fetchTotalDevisFromDB();
        res.status(200).json({ total: totalDevis });
    } catch (error) {
        console.error('Erreur lors de la récupération du total des devis:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

// Fonction pour récupérer le montant moyen des devis
const fetchAverageDevis = async (req, res) => {
    try {
        const averageMontant = await getAverageDevis();
        console.log('Montant moyen:', averageMontant); // Affichez la valeur réelle
        res.json({ averageMontant }); // Renvoie la valeur correcte
    } catch (error) {
        console.error('Erreur lors de la récupération du montant moyen des devis:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' }); // Message d'erreur générique
    }
};

const fetchMinMaxDevis = async (req, res) => {
    try {
        // Appelez la fonction pour obtenir les montants min et max
        const { minMontant, maxMontant } = await getMinMaxDevis();
        // console.log('Montant minimum:', minMontant); // Vérifiez cette ligne
        // console.log('Montant maximum:', maxMontant); // Vérifiez cette ligne
        
        // Renvoie les valeurs correctes
        res.json({ minMontant, maxMontant }); 
    } catch (error) {
        console.error('Erreur lors de la récupération des montants min et max des devis:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

// Contrôleur pour ajouter un permis
const addPermis = async (req, res) => {
  const { numDevis, numQuittance, datePermis } = req.body;

  try {
      const permis = await createPermis(numDevis, numQuittance, datePermis);
      res.status(201).json({ success: true, data: permis });
  } catch (error) {
      console.error('Erreur lors de la création du permis :', error);
      res.status(500).json({ success: false, message: 'Erreur lors de la création du permis' });
  }
};


const downloadDevisPdf = async (req, res) => {
  try {
    const { numDevis } = req.params;
    const devis = await getDevisById(numDevis);

    if (!devis) {
      return res.status(404).json({ error: 'Devis introuvable' });
    }
    //création d'un nouveau document PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachement; filename=avis-${numDevis}.pdf`);
    

    const madaCenterPath = path.join(__dirname, './assets/mada.jpg');

      // Définir une largeur plus grande pour l'image au centre
      const pageWidth = doc.page.width;
      const imageWidth = 200; // Largeur de l'image
      const centerX = (pageWidth - imageWidth) / 2; // Calculer la position X pour centrer l'image

      // Ajouter l'image au centre en haut
      doc.image(madaCenterPath, centerX, 40, { width: imageWidth });
      doc.moveDown(6); // Ajustement de l'espacement entre l'image et le logo

      const logoLeftPath = path.join(__dirname, './assets/logo.jpg');


      // Ajouter le logo à gauche
      doc.image(logoLeftPath, 40, 100, { width: 60 }); // Positionner le logo à gauche
      doc.moveDown(1); // Espacement entre le logo et le texte

    // Fonction pour ajuster l'interligne à 1,5
    const moveDownCustom = (doc, fontSize) => {
      const lineHeight = fontSize * 1.5; // Calculer l'interligne de 1,5
      doc.moveDown(lineHeight / fontSize); // Diviser pour compenser le facteur d'espacement
    };

    const formattedDateDemande = devis.dateDemande ? new Date(devis.dateDemande).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A';
    
    // Utilisation de moveDownCustom pour ajouter un interligne de 1,5
    doc.fontSize(14).font('Helvetica-Bold').text("COMMUNE URBAINE DE FIANARANTSOA", { align: 'center' });
    doc.fontSize(14).font('Helvetica-Bold').text("-------------------------------", { align: 'center' });
    doc.fontSize(14).font('Helvetica-Bold').text("SERVICE DE DEVELOPPEMENT URBAIN ET HABITAT", { align: 'center' });
    doc.fontSize(14).font('Helvetica-Bold').text("-------------------------------", { align: 'center' });
    doc.fontSize(14).font('Helvetica-Bold').text(`AVIS DE PAIEMENT DU DEVIS NUMERO ${devis.numDevis}`, { align: 'center' });

    // Espacement de 1,5
    moveDownCustom(doc, 14);

    doc.fontSize(12).font('Helvetica-Bold').text(`Numéro de la demande : ${devis.numDemande}`, { align: 'left' });
    moveDownCustom(doc, 12);
    doc.fontSize(12).font('Helvetica-Bold').text(`Nom du client : ${devis.nomClient}`, { align: 'left' });
    moveDownCustom(doc, 12);
    doc.fontSize(12).font('Helvetica-Bold').text(`Type de demande : ${devis.typeDemande}`, { align: 'left' });
    moveDownCustom(doc, 12);
    doc.fontSize(12).font('Helvetica-Bold').text(`Date de demande : ${formattedDateDemande}`, { align: 'left' });
    moveDownCustom(doc, 12);
    doc.fontSize(12).font('Helvetica-Bold').text(`Lieu de construction : ${devis.lieu}`, { align: 'left' });
    moveDownCustom(doc, 12);
    doc.fontSize(12).font('Helvetica-Bold').text(`Prix de la Longueur : ${devis.prixLongueur} Ariary`, { align: 'left' });
    moveDownCustom(doc, 12);
    doc.fontSize(12).font('Helvetica-Bold').text(`Prix de la Largeur : ${devis.prixLargeur} Ariary`, { align: 'left' });
    moveDownCustom(doc, 8);
    doc.fontSize(12).font('Helvetica-Bold').text(`____________________________________________________`, { align: 'left' });
    moveDownCustom(doc, 8);
    doc.fontSize(12).font('Helvetica-Bold').text(`Montant à payé : ${devis.montant} Ariary`, { align: 'left' });

    moveDownCustom(doc, 12); // Espacement de 1,5

    doc.fontSize(14).font('Helvetica-Bold').text("MERCI DE VOTRE CONFIANCE", { align: 'center' });

    console.log("generateDevisPdf - PDF généré avec succès.");

    doc.pipe(res);
    doc.end();
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors du téléchargement du devis' });
  }
}

// demande avec état de devis
const fetchDemandsByDevisState = async (req, res) => {
  try {
    const data = await getDemandsByDevisState();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching demands by devis state:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des données' });
  }
};

// Récupérer les devis triés par nomClient
const fetchDevisSortedByClientName = async (req, res) => {
  try {
      const devis = await getDevisSortedByClientName();
      res.json(devis);
  } catch (err) {
      console.error('Error in getDevisSortedByClientName controller:', err);
      res.status(500).send('Internal Server Error');
  }
};

// Fonction pour récupérer les devis avec permis et client
const getDevisWithPermisAndClient = async (req, res) => {
  try {
    // console.log('Appel de la fonction getDevisWithPermisAndClient');
      const devis = await fetchDevisWithPermisAndClient();
      // console.log('Devis reçus dans le contrôleur:', devis);
      res.json(devis); // Retourner les devis avec les informations du client et permis
  } catch (error) {
      console.error('Erreur lors de la récupération des devis:', error);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération des devis' });
  }
};

module.exports = { addDevis, getAllDevis, deleteDevis, getTotalDevis, fetchDevisSortedByClientName, getDevisWithPermisAndClient,
  fetchAverageDevis, fetchMinMaxDevis, markDevisAsPaid, addPermis, downloadDevisPdf, fetchDemandsByDevisState};