const { createResponsable, getResponsables, getResponsableByIdFromModel, updateResponsable, deleteResponsableById } = require('../models/responsableModel');

// créer un responsable
const addResponsable = async (req, res) => {
    try {
        const newResponsable = await createResponsable(req.body);
        res.status(201).json(newResponsable);
    } catch (error) {
        res.status(500).json({error: error.message })
    }
};


// Récupérer tous les responsables
const getAllResponsables = async (req, res) => {
    try {
      const responsable = await getResponsables();
      res.json(responsable);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Récupérer un responsable spécifique
const getResponsableById = async (req, res) => {
    const { numResponsable } = req.params;
    try {
      const responsable = await getResponsableByIdFromModel(numResponsable); // Appeler la fonction dans le modèle
      if (!responsable) {
        return res.status(404).json({ message: 'Responsable non trouvé' });
      }
      res.json(responsable);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Mettre à jour un responsable
const modifyResponsable = async (req, res) => {
  const { numResponsable } = req.params;
  try {
    const updatedResponsable = await updateResponsable(numResponsable, req.body);
    res.json(updatedResponsable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Supprimer un responsable
const deleteResponsable = async (req, res) => {
  const { numResponsable } = req.params;
  try {
    await deleteResponsableById(numResponsable); // Appel de la fonction dans le modèle
    res.status(204).send(); // Réponse vide indiquant une suppression réussie
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addResponsable, getAllResponsables, getResponsableById, modifyResponsable, deleteResponsable };