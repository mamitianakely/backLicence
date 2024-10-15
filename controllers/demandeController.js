const { createDemande, getDemandes, getDemandeByIdFromModel, updateDemande, deleteDemandeById } = require('../models/demandeModel');

// créer une demande
const addDemande = async (req, res) => {
    try {
      const newDemande = await createDemande(req.body);
      res.status(201).json(newDemande);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Récupérer tous les demandes
const getAllDemandes = async (req, res) => {
    try {
      const demande = await getDemandes();
      res.json(demande);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Récupérer un demande spécifique
const getDemandeById = async (req, res) => {
  const { numDemande} = req.params;
  try {
    const demande = await getDemandeByIdFromModel(numDemande); // Appeler la fonction dans le modèle
    if (!demande) {
      return res.status(404).json({ message: 'Demande non trouvé' });
    }
    res.json(demande);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un demande
const modifyDemande = async (req, res) => {
  const { numDemande } = req.params;
  try {
    const updatedDemande = await updateDemande(numDemande, req.body);
    res.json(updatedDemande);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un demande
const deleteDemande = async (req, res) => {
  const { numDemande } = req.params;
  try {
    await deleteDemandeById(numDemande); // Appel de la fonction dans le modèle
    res.status(204).send(); // Réponse vide indiquant une suppression réussie
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addDemande, getAllDemandes, getDemandeById, modifyDemande, deleteDemande };