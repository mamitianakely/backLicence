const express = require('express');
const router = express.Router();
const { addClient, getAllClients, modifyClient, getClientById, deleteClient } = require('../controllers/clientController'); // Importer le contrôleur

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



module.exports = router;
