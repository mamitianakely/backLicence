const { createDevis, getDevis, deleteDevisById } = require('../models/devisModel');

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


module.exports = { addDevis, getAllDevis, deleteDevis };