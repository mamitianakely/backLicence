const express = require('express');
const router = express.Router();
const { addAvis, getAllAvis, deleteAvis, payerAvis, generateFacturePdf } = require('../controllers/avisController');

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

module.exports = router;