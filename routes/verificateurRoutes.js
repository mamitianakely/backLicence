const express = require('express');
const router = express.Router();
const { addVerificateur, getAllVerificateurs, getVerificateurById, modifyVerificateur, deleteVerificateur } = require('../controllers/verificateurController');

// Route pour ajouter un verificateur
router.post('/', addVerificateur);

// Route pour recuperer tous les vérificateur
router.get('/', getAllVerificateurs);

// Route pour récupérer un verificateur spécifique
router.get('/:numVerificateur', getVerificateurById);

// Route pour mettre à jour un verificateur
router.put('/:numVerificateur', modifyVerificateur);

// Route pour supprimer un verificateur
router.delete('/:numVerificateur', deleteVerificateur);

module.exports = router;