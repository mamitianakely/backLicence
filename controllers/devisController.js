const { createDevis, getDevis, deleteDevisById, fetchTotalDevisFromDB, 
  getAverageDevis, getMinMaxDevis, getDevisById, updateDevisStateToPaid, createPermis } = require('../models/devisModel');
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

  //générer facture
  const generateDevisPdf = async (req, res) => {
    const { numDevis } = req.params;
  
    try {
      const devisData = await getDevisById(numDevis);
  
      if (!devisData) {
        return res.status(404).json({ message: 'devis non trouvé.' });
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

      const formattedDateDemande = devisData.dateDemande ? new Date(devisData.dateDemande).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A';
      
      // Utilisation de moveDownCustom pour ajouter un interligne de 1,5
      doc.fontSize(14).font('Helvetica-Bold').text("COMMUNE URBAINE DE FIANARANTSOA", { align: 'center' });
      doc.fontSize(14).font('Helvetica-Bold').text("-------------------------------", { align: 'center' });
      doc.fontSize(14).font('Helvetica-Bold').text("SERVICE DE DEVELOPPEMENT URBAIN ET HABITAT", { align: 'center' });
      doc.fontSize(14).font('Helvetica-Bold').text("-------------------------------", { align: 'center' });
      doc.fontSize(14).font('Helvetica-Bold').text(`AVIS DE PAIEMENT DU DEVIS NUMERO ${devisData.numDevis}`, { align: 'center' });
  
      // Espacement de 1,5
      moveDownCustom(doc, 14);
  
      doc.fontSize(12).font('Helvetica-Bold').text(`Numéro de la demande : ${devisData.numDemande}`, { align: 'left' });
      moveDownCustom(doc, 12);
      doc.fontSize(12).font('Helvetica-Bold').text(`Nom du client : ${devisData.nomClient}`, { align: 'left' });
      moveDownCustom(doc, 12);
      doc.fontSize(12).font('Helvetica-Bold').text(`Type de demande : ${devisData.typeDemande}`, { align: 'left' });
      moveDownCustom(doc, 12);
      doc.fontSize(12).font('Helvetica-Bold').text(`Date de demande : ${formattedDateDemande}`, { align: 'left' });
      moveDownCustom(doc, 12);
      doc.fontSize(12).font('Helvetica-Bold').text(`Lieu de construction : ${devisData.lieu}`, { align: 'left' });
      moveDownCustom(doc, 12);
      doc.fontSize(12).font('Helvetica-Bold').text(`Prix de la Longueur : ${devisData.prixLongueur} Ariary`, { align: 'left' });
      moveDownCustom(doc, 12);
      doc.fontSize(12).font('Helvetica-Bold').text(`Prix de la Largeur : ${devisData.prixLargeur} Ariary`, { align: 'left' });
      moveDownCustom(doc, 8);
      doc.fontSize(12).font('Helvetica-Bold').text(`____________________________________________________`, { align: 'left' });
      moveDownCustom(doc, 8);
      doc.fontSize(12).font('Helvetica-Bold').text(`Montant à payé : ${devisData.montant} Ariary`, { align: 'left' });
  
      moveDownCustom(doc, 12); // Espacement de 1,5
  
      doc.fontSize(14).font('Helvetica-Bold').text("MERCI DE VOTRE CONFIANCE", { align: 'center' });
  
      doc.pipe(res);
      doc.end();
    } catch (error) {
      console.error("Erreur lors de la génération du PDF :", error);
      res.status(500).json({ message: 'Erreur lors de la génération du PDF.', error: error.message });
    }
  };
  

//  // Mise à jour de l'état d'un devis
// const updateEtatDevis = async (req, res) => {
//   try {
//     const { numDevis } = req.params;
//     console.log(`Mise à jour de l'état du devis ${numDevis}`);
//     await updateDevisEtat(numDevis);
//     console.log(`L'état du devis ${numDevis} a été mis à jour avec succès.`);
//     res.status(200).json({ message: 'État du devis mis à jour avec succès.' });
//   } catch (error) {
//     res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'état du devis.' });
//   }
// };

// // Ajout d'un permis après la mise à jour de l'état du devis
// const addPermis = async (req, res) => {
//   try {
//     const { numDevis } = req.params;
//     const { numQuittance, datePermis } = req.body;

//     console.log(`Ajout du permis pour le devis ${numDevis} avec les informations suivantes:`);
//     console.log(`Numéro de quittance: ${numQuittance}, Date du permis: ${datePermis}`);

//     const permis = await createPermis(numDevis, numQuittance, datePermis);

//     console.log(`Permis ajouté avec succès pour le devis ${numDevis}.`);
//     res.status(201).json(permis);
//   } catch (error) {
//     res.status(500).json({ error: 'Erreur lors de l\'ajout du permis.' });
//   }
// };

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

module.exports = { addDevis, getAllDevis, deleteDevis, getTotalDevis, 
  fetchAverageDevis, fetchMinMaxDevis, generateDevisPdf, markDevisAsPaid, addPermis};