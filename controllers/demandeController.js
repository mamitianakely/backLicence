const { createDemande, getDemandes, getDemandeByIdFromModel, updateDemande, 
  deleteDemandeById, getPendingDemandesCount, getDemandesByTypeAndMonth, 
  getDemandesByMonth, getTotalDemandesFromDB, getCountOfDemandsAwaitingDevisFromDB, getConversionRateFromDB,
  calculateDemandsWithAvisPercentage, findDemandsBetweenDates  } = require('../models/demandeModel');

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


const getCountOfDemandsAwaitingDevis = async (req, res) => {
  try {
    const demandsAwaitingDevisCount = await getCountOfDemandsAwaitingDevisFromDB();
    res.status(200).json({ count: demandsAwaitingDevisCount }); // Changez ici pour renvoyer "count"
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de demandes en attente de devis:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const getConversionRate = async (req, res) => {
  try {
    const conversionRate = await getConversionRateFromDB();
    res.status(200).json({ conversionRate }); // Retourne la conversionRate dans un objet JSON
  } catch (error) {
    console.error('Erreur lors de la récupération du taux de conversion:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const getDemandsWithAvisPercentage = async (req, res) => {
  try {
    const percentage = await calculateDemandsWithAvisPercentage();
    res.status(200).json({ percentage });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du calcul du pourcentage des demandes avec avis de paiement', error });
  }
};

// Contrôleur pour rechercher des demandes entre deux dates
const getDemandsBetweenDates = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: "Les dates de début et de fin sont requises." });
  }

  try {
    const demande = await findDemandsBetweenDates(startDate, endDate);
    res.status(200).json(demande);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des demandes." });
  }
};

module.exports = { addDemande, getAllDemandes, getDemandeById, modifyDemande, getDemandsBetweenDates,
  deleteDemande, getPendingDemandes, getDemandesStatsByTypeAndMonth, fetchDemandesByMonth, 
  getTotalDemandes, getCountOfDemandsAwaitingDevis, getConversionRate, getDemandsWithAvisPercentage };