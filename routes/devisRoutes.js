const express= require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { addDevis, getAllDevis, deleteDevis, getTotalDevis, fetchAverageDevis, fetchDevisSortedByClientName,
    fetchMinMaxDevis, markDevisAsPaid, addPermis, downloadDevisPdf, fetchDemandsByDevisState, getDevisWithPermisAndClient } = require('../controllers/devisController');

// Applique le middleware à toutes les routes
router.use(authenticateToken);

//routes pour ajouter un devis
router.post('/', addDevis);

// Route pour récupérer tous les devis
router.get('/', getAllDevis);

// Route pour supprimer un devis
router.delete('/:numDevis', deleteDevis); // Nouvelle route pour supprimer un client

// Route pour obtenir le nombre total de devis générés
router.get('/total-devis', getTotalDevis);

// Route pour obtenir le montant moyen des devis
router.get('/average', fetchAverageDevis);

// Route pour min et max de devis
router.get('/minmax', fetchMinMaxDevis);

// // Route pour la facture
// router.get('/pdfdown/:numDevis', generateDevisPdf);


// Route pour marquer le devis comme payé et ouvrir le modal
router.put('/:numDevis/payer', markDevisAsPaid);

// // Route pour enregistrer les détails du permis (numQuittance et datePermis)
// router.post('/:numDevis/permis', addPermis);

// Route pour ajouter un permis
router.post('/permis', addPermis);

// // Route pour générer une facture PDF
// router.get('/generate-invoice/:numDevis', generateInvoice);

// Route pour télécharger la facture de devis
router.get('/get-pdf/:numDevis', downloadDevisPdf);

// demande avec état de devis
router.get('/states/demands-by-devis-state', fetchDemandsByDevisState);

// Route pour récupérer les devis triés par nomClient
router.get('/tri/sorted-by-client', fetchDevisSortedByClientName);

// Route pour récupérer les devis avec l'information du permis et du client
router.get('/tri/withPermisAndClient', getDevisWithPermisAndClient);

module.exports = router;