const { createDemande, getDemandes, getDemandeByIdFromModel, updateDemande, 
  deleteDemandeById, getPendingDemandesCount, getDemandesByTypeAndMonth, getDemandesByMonth, getTotalDemandesFromDB } = require('../models/demandeModel');

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

// Récupérer le nombre de demandes en attente
const getPendingDemandes = async (req, res) => {
  try {
    const count = await getPendingDemandesCount();
    res.json({ pendingDemandesCount: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer les demandes par type et par mois pour les statistiques
const getDemandesStatsByTypeAndMonth = async (req, res) => {
  try {
    const data = await getDemandesByTypeAndMonth();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const fetchDemandesByMonth = async (req, res) => {
  try {
      const demandes = await getDemandesByMonth();
      res.json(demandes);
  } catch (error) {
      console.error('Error fetching demandes by month:', error.message);
      res.status(500).json({ error: 'Failed to fetch demandes by month' });
  }
};

// Fonction pour obtenir le total des demandes
const getTotalDemandes = async (req, res) => {
  try {
      const total = await getTotalDemandesFromDB();
      res.status(200).json({ total }); // Renvoie l'objet avec le total
  } catch (error) {
      console.error('Erreur lors de la récupération du total des demandes:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

module.exports = { addDemande, getAllDemandes, getDemandeById, modifyDemande, 
  deleteDemande, getPendingDemandes, getDemandesStatsByTypeAndMonth, fetchDemandesByMonth, getTotalDemandes };