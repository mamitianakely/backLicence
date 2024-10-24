const { createClient, getClients, updateClient, getClientByIdFromModel, deleteClientById, getTotalClients } = require('../models/clientModel'); // Importation des fonctions nécessaires

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

module.exports = { addClient, getAllClients, modifyClient, getClientById, deleteClient, getClientStats  };
