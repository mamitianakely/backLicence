const express = require('express');
const router = express.Router();
const { addClient, getAllClients, modifyClient,
     getClientById, deleteClient, getClientStats, fetchClientsDistributionByRegion,
     getClientsWithoutDemands} = require('../controllers/clientController'); // Importer le contrôleur

// Route pour ajouter un client
router.post('/', addClient);

// Route pour récupérer tous les clients
router.get('/', getAllClients);

// Route pour récupérer un client spécifique (pour la modification)
router.get('/:numChrono', getClientById);  // Ajout de cette route pour un client spécifique

// Route pour mettre à jour un client
router.put('/:numChrono', modifyClient);

// Route pour supprimer un client
router.delete('/:numChrono', deleteClient); // Nouvelle route pour supprimer un client

// Route pour obtenir le nombre total de clients
router.get('/stats/total', getClientStats);

// Route pour obtenir la distribution des clients par zone géographique
router.get('/stats/distribution', fetchClientsDistributionByRegion);

// Route pour obtenir le nombre de clients sans demande
router.get('/stats/sans-demands', getClientsWithoutDemands);

module.exports = router;
