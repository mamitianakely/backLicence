const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { addDemande, getAllDemandes, getDemandeById, modifyDemande, deleteDemande, getPendingDemandes, getDemandesStatsByTypeAndMonth, 
    fetchDemandesByMonth,  getTotalDemandes, getCountOfDemandsAwaitingDevis, getConversionRate , getDemandsWithAvisPercentage, getDemandsBetweenDates, listDemandesWithDevis} = require('../controllers/demandeController');


// Applique le middleware à toutes les routes
router.use(authenticateToken);

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

router.get('/stats/count-awaiting-devis', getCountOfDemandsAwaitingDevis);

router.get('/stats/conversion-rate', getConversionRate);

// Route pour obtenir le pourcentage des demandes avec avis de paiement
router.get('/stats/percentage-with-avis', getDemandsWithAvisPercentage);

// Route pour rechercher des demands entre deux dates
router.get('/search/searchDateDemands', getDemandsBetweenDates);

router.get('/stats/withdevis', listDemandesWithDevis);

module.exports = router;