const { createDevis, getDevis, deleteDevisById, fetchTotalDevisFromDB, getAverageDevis, getMinMaxDevis  } = require('../models/devisModel');

// créer un Devis
const addDevis = async (req, res) => {
    try {
        //console.log('Données reçues:', req.body); // Ajoute ceci pour voir les données reçues
        const newDevis = await createDevis(req.body);
        res.status(201).json(newDevis);
    } catch (error) {
        console.error('Erreur lors de l\'ajout du devis:', error); // Affiche l'erreur dans la console
        res.status(500).json({ error: error.message });
    }
};

// Récupérer tous les devis
const getAllDevis = async (req, res) => {
    try {
        const devis = await getDevis();
        res.json(devis);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Supprimer un devis
const deleteDevis = async (req, res) => {
    const { numDevis } = req.params;
    try {
      await deleteDevisById(numDevis); // Appel de la fonction dans le modèle
      res.status(204).send(); // Réponse vide indiquant une suppression réussie
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getTotalDevis = async (req, res) => {
    try {
        const totalDevis = await fetchTotalDevisFromDB();
        res.status(200).json({ total: totalDevis });
    } catch (error) {
        console.error('Erreur lors de la récupération du total des devis:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

// Fonction pour récupérer le montant moyen des devis
const fetchAverageDevis = async (req, res) => {
    try {
        const averageMontant = await getAverageDevis();
        console.log('Montant moyen:', averageMontant); // Affichez la valeur réelle
        res.json({ averageMontant }); // Renvoie la valeur correcte
    } catch (error) {
        console.error('Erreur lors de la récupération du montant moyen des devis:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' }); // Message d'erreur générique
    }
};

const fetchMinMaxDevis = async (req, res) => {
    try {
        // Appelez la fonction pour obtenir les montants min et max
        const { minMontant, maxMontant } = await getMinMaxDevis();
        // console.log('Montant minimum:', minMontant); // Vérifiez cette ligne
        // console.log('Montant maximum:', maxMontant); // Vérifiez cette ligne
        
        // Renvoie les valeurs correctes
        res.json({ minMontant, maxMontant }); 
    } catch (error) {
        console.error('Erreur lors de la récupération des montants min et max des devis:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

module.exports = { addDevis, getAllDevis, deleteDevis, getTotalDevis, fetchAverageDevis, fetchMinMaxDevis };