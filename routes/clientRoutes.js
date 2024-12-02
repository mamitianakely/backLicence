const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { addClient, getAllClients, modifyClient,
     getClientById, deleteClient, getClientStats, fetchClientsDistributionByRegion,
     getClientsWithoutDemands, listClientsWithDemandes} = require('../controllers/clientController'); // Importer le contrôleur


// Applique le middleware à toutes les routes
router.use(authenticateToken);

// Route pour ajouter un client
router.post('/', addClient);

// Route pour récupérer tous les clients
router.get('/', getAllClients);

// Route pour récupérer un client spécifique (pour la modification)
router.get('/:numChrono', getClientById);  // Ajout de cette route pour un client spécifique

// Route pour mettre à jour un client
router.put('/:numChrono', modifyClient);

// Route pour supprimer un client
router.delete('/:numChrono', deleteClient);

// Route pour obtenir le nombre total de clients
router.get('/stats/total', getClientStats);

// Route pour obtenir la distribution des clients par zone géographique
router.get('/stats/distribution', fetchClientsDistributionByRegion);

// Route pour obtenir le nombre de clients sans demande
router.get('/stats/sans-demands', getClientsWithoutDemands);

// Route pour récupérer les clients avec leur statut de demande
router.get('/stats/withdemandes', listClientsWithDemandes);

module.exports = router;
