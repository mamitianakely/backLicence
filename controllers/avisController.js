const { createAvis, getAvis, deleteAvisById, updateEtatAvis, getAvisByNum, migrateToPermis, getAvisById } = require('../models/avisModel');
const PDFDocument = require('pdfkit');

// créer un avis de paiement
const addAvis = async (req, res) => {
  try {
    const newAvis = await createAvis(req.body);
    res.status(201).json(newAvis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer tous les avis
const getAllAvis = async (req, res) => {
  try {
    const avis = await getAvis();
    res.json(avis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un avis
const deleteAvis = async (req, res) => {
  const { numAvis } = req.params;
  try {
    await deleteAvisById(numAvis); // Appel de la fonction dans le modèle
    res.status(204).send(); // Réponse vide indiquant une suppression réussie
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Payer un avis et le migrer dans la table permis
const payerAvis = async (req, res) => {
  const { numAvis } = req.params;

  try {
    // 1. Mettre à jour l'état de l'avis à "payé"
    await updateEtatAvis(numAvis, 'payé');

    // 2. Récupérer les informations nécessaires de l'avis à partir de la base de données
    const avisData = await getAvisByNum(numAvis);

    if (!avisData) {
      return res.status(404).json({ error: "Avis non trouvé" });
    }

    // 3. Migrer les données dans la table permis
    await migrateToPermis(avisData);

    res.status(200).json({ message: "L'avis a été payé et migré vers la table permis." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const generateFacturePdf = async (req, res) => {
  const { numAvis } = req.params;

  try {
    const avisData = await getAvisById(numAvis);

    if (!avisData) {
      return res.status(404).json({ message: 'avis de paiement non trouvé.' });
    }

    //création d'un nouveau document PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachement; filename=avis-${numAvis}.pdf`);

    doc.fontSize(14).font('Helvetica-Bold').text("COMMUNE URBAINE DE FIANARANTSOA", { align: 'center' });
    doc.fontSize(14).font('Helvetica-Bold').text("-------------------------------", { align: 'center' });
    doc.fontSize(14).font('Helvetica-Bold').text("SERVICE DE DEVELOPPEMENT URBAIN ET HABITAT", { align: 'center' });
    doc.fontSize(14).font('Helvetica-Bold').text("-------------------------------", { align: 'center' });

    doc.moveDown(6);

    doc.fontSize(12).font('Helvetica-Bold').text(`Nom du client : ${avisData.nomClient}`, { align: 'left' });
    doc.fontSize(12).font('Helvetica-Bold').text(`Numero de quittance : ${avisData.numQuittance}`, { align: 'left' });
    doc.fontSize(12).font('Helvetica-Bold').text(`Lieu de construction : ${avisData.lieu}`, { align: 'left' });
    doc.fontSize(12).font('Helvetica-Bold').text(`Longueur du terrain : ${avisData.prixLongueur} Ariary`, { align: 'left' });
    doc.fontSize(12).font('Helvetica-Bold').text(`Largeur du terrain : ${avisData.prixLargeur} Ariary`, { align: 'left' });
    doc.fontSize(12).font('Helvetica-Bold').text(`Montant payé : ${avisData.montant} Ariary`, { align: 'left' });


    doc.moveDown(2);

    doc.fontSize(14).font('Helvetica-Bold').text("MERCI DE VOTRE CONFIANCE", { align: 'center' });

    doc.pipe(res);
        doc.end();
  } catch (error) {
    console.error("Erreur lors de la génération du PDF :", error);
    res.status(500).json({ message: 'Erreur lors de la génération du PDF.', error: error.message });
  }
};

module.exports = { addAvis, getAllAvis, deleteAvis, payerAvis, generateFacturePdf };