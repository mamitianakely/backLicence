const express = require('express');
const router = express.Router();
const { addAvis, getAllAvis, deleteAvis, payerAvis, generateFacturePdf, 
    fetchAcceptedPaiementCount, fetchPaiementsByState, getTotalAvisPaiement, getAvisBetweenDates } = require('../controllers/avisController');

// Route pour ajouter un avis
router.post('/', addAvis);

// Route pour récupérer tous les avis
router.get('/', getAllAvis);

// Route pour supprimer un avis
router.delete('/:numAvis', deleteAvis);

// Route pour changer l'état et migrer l'avis
router.put('/:numAvis/payer', payerAvis);

// Route pour la facture
router.get('/pdf/:numAvis', generateFacturePdf);

// Route pour récupérer le nombre d'avis de paiement acceptés
router.get('/accepted-paiement-count', fetchAcceptedPaiementCount);

router.get('/paiements-by-state', fetchPaiementsByState);  // Ajoute cette ligne


router.get('/paiementsTotal', getTotalAvisPaiement);  // Ajoute cette ligne

// Route pour rechercher des avis entre deux dates
router.get('/searchDates', getAvisBetweenDates);

module.exports = router;