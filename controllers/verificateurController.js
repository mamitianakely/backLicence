const { createVerificateur, getVerificateurs, getVerificateurByIdFromModel, updateVerificateur, deleteVerificateurById } = require('../models/verificateurModel');

// créer un nouveau verificateur
const addVerificateur = async (req, res) => {
    try {
      const newVerificateur = await createVerificateur(req.body);
      res.status(201).json(newVerificateur);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Recuperer tous les verificateur
const getAllVerificateurs = async (req, res) => {
  try{
    const verificateur = await getVerificateurs();
    res.json(verificateur);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer un verificateur spécifique
const getVerificateurById = async (req, res) => {
  const { numVerificateur } = req.params;
  try {
    const verificateur = await getVerificateurByIdFromModel(numVerificateur); // Appeler la fonction dans le modèle
    if (!verificateur) {
      return res.status(404).json({ message: 'Verificateur non trouvé' });
    }
    res.json(verificateur);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un verificateur
const modifyVerificateur = async (req, res) => {
  const { numVerificateur } = req.params;
  try {
    const updatedVerificateur = await updateVerificateur(numVerificateur, req.body);
    res.json(updatedVerificateur);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un verificateur
const deleteVerificateur = async (req, res) => {
  const { numVerificateur } = req.params;
  try {
    await deleteVerificateurById(numVerificateur);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { addVerificateur, getAllVerificateurs, getVerificateurById, modifyVerificateur, deleteVerificateur };