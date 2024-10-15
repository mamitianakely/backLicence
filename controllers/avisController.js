const { createAvis, getAvis, deleteAvisById, updateEtatAvis, getAvisByNum, migrateToPermis } = require('../models/avisModel');

// créer un avis de paiement
const addAvis = async (req, res) => {
    try {
      const newAvis = await createAvis(req.body);
      res.status(201).json(newAvis);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Récupérer tous les avis
const getAllAvis = async (req, res) => {
  try {
      const avis = await getAvis();
      res.json(avis);
  } catch (error) {
      res.status(500).json({error: error.message});
  }
};

// Supprimer un avis
const deleteAvis = async (req, res) => {
  const { numAvis } = req.params;
  try {
    await deleteAvisById(numAvis); // Appel de la fonction dans le modèle
    res.status(204).send(); // Réponse vide indiquant une suppression réussie
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Payer un avis et le migrer dans la table permis
const payerAvis = async (req, res) => {
  const { numAvis } = req.params;

  try {
      // 1. Mettre à jour l'état de l'avis à "payé"
      await updateEtatAvis(numAvis, 'payé');

      // 2. Récupérer les informations nécessaires de l'avis à partir de la base de données
      const avisData = await getAvisByNum(numAvis);

      if (!avisData) {
          return res.status(404).json({ error: "Avis non trouvé" });
      }

      // 3. Migrer les données dans la table permis
      await migrateToPermis(avisData);

      res.status(200).json({ message: "L'avis a été payé et migré vers la table permis." });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

module.exports = { addAvis, getAllAvis, deleteAvis, payerAvis };