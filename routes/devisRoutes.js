const express= require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { addDevis, getAllDevis, deleteDevis, getTotalDevis, fetchAverageDevis, 
    fetchMinMaxDevis, generateDevisPdf, markDevisAsPaid, addPermis } = require('../controllers/devisController');

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

// Route pour la facture
router.get('/downpdf/:numDevis', generateDevisPdf);

// Route pour marquer le devis comme payé et ouvrir le modal
router.put('/:numDevis/payer', markDevisAsPaid);

// // Route pour enregistrer les détails du permis (numQuittance et datePermis)
// router.post('/:numDevis/permis', addPermis);

// Route pour ajouter un permis
router.post('/permis', addPermis);


module.exports = router;