const { createClient, getClients, updateClient, getClientByIdFromModel, 
  deleteClientById, getTotalClients, getClientsDistributionByRegion, 
  getClientsWithoutDemandsCount, fetchClientsWithDemandes  } = require('../models/clientModel'); // Importation des fonctions nécessaires

// Créer un nouveau client
const addClient = async (req, res) => {
  try {
    const newClient = await createClient(req.body);
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer tous les clients
const getAllClients = async (req, res) => {
  try {
    const clients = await getClients();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer un client spécifique
const getClientById = async (req, res) => {
  const { numChrono} = req.params;
  try {
    const client = await getClientByIdFromModel(numChrono); // Appeler la fonction dans le modèle
    if (!client) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un client
const modifyClient = async (req, res) => {
  const { numChrono } = req.params;
  try {
    const updatedClient = await updateClient(numChrono, req.body);
    res.json(updatedClient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un client
const deleteClient = async (req, res) => {
  const { numChrono } = req.params;
  try {
    await deleteClientById(numChrono); // Appel de la fonction dans le modèle
    res.status(204).send(); // Réponse vide indiquant une suppression réussie
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer le nombre total de clients
const getClientStats = async (req, res) => {
  try {
    const totalClients = await getTotalClients();
    res.json({ totalClients });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour récupérer la distribution des clients par région
// Contrôleur pour récupérer la distribution des clients par région
const fetchClientsDistributionByRegion = async (req, res) => {

  try {
    const distribution = await getClientsDistributionByRegion();
    
    if (distribution.length === 0) {
      return res.status(404).json({ message: "Aucune région trouvée pour les clients" });
    }
    res.status(200).json(distribution);
  } catch (error) {
    console.error("Erreur lors de la récupération de la distribution des clients par région :", error.message);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Contrôleur pour obtenir le nombre de clients sans demande
const getClientsWithoutDemands = async (req, res) => {
  try {
    const count = await getClientsWithoutDemandsCount();
    res.status(200).json({ clientsSansDemande: count });
  } catch (error) {
    console.error('Erreur lors de la récupération des clients sans demande:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des clients sans demande" });
  }
};

const listClientsWithDemandes = async (req, res) => {
  try {
    const clients = await fetchClientsWithDemandes(); // Appel du modèle
    res.status(200).json(clients);
  } catch (error) {
    console.error("Erreur lors de la récupération des clients avec leurs demandes :", error.message);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

module.exports = { addClient, getAllClients, modifyClient, getClientById, deleteClient, 
  getClientStats, fetchClientsDistributionByRegion, getClientsWithoutDemands, listClientsWithDemandes };
