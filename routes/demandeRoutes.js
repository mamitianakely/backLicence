const express = require('express');
const router = express.Router();
const { addDemande, getAllDemandes, getDemandeById, modifyDemande, deleteDemande } = require('../controllers/demandeController');

// Route pour ajouter un demande
router.post('/', addDemande);

// Route pour récupérer tous les demandes
router.get('/', getAllDemandes);

// Route pour récupérer un client spécifique (pour la modification)
router.get('/:numDemande', getDemandeById);  // Ajout de cette route pour un demande spécifique

// Route pour mettre à jour un demande
router.put('/:numDemande', modifyDemande);

// Route pour supprimer un demande
router.delete('/:numDemande', deleteDemande); // Nouvelle route pour supprimer un client

module.exports = router;