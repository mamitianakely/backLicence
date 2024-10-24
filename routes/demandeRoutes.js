const express = require('express');
const router = express.Router();
const { addDemande, getAllDemandes, getDemandeById, modifyDemande, 
    deleteDemande, getPendingDemandes, getDemandesStatsByTypeAndMonth, fetchDemandesByMonth,  getTotalDemandes } = require('../controllers/demandeController');

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


// Route pour récupérer le nombre de demandes en attente
router.get('/pending/count', getPendingDemandes);

// Route pour récupérer les demandes par type et par mois pour les statistiques
router.get('/stats/type-by-month', getDemandesStatsByTypeAndMonth);

// Route pour récupérer les demandes par mois
router.get('/stats/monthly', fetchDemandesByMonth);


// Route pour obtenir le total des demandes
router.get('/stats/total', getTotalDemandes);

module.exports = router;