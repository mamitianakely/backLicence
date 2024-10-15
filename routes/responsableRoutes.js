const express = require('express');
const router = express.Router();
const { addResponsable, getAllResponsables, getResponsableById, modifyResponsable, deleteResponsable } = require('../controllers/responsableController');

// Route pour ajouter un responsable
router.post('/', addResponsable);

// Route pour récupérer tous les responsables
router.get('/', getAllResponsables);

// Route pour récupérer un responsable spécifique (pour la modification)
router.get('/:numResponsable', getResponsableById);  // Ajout de cette route pour un responsable spécifique

// Route pour mettre à jour un responsable
router.put('/:numResponsable', modifyResponsable);

// Route pour supprimer un responsable
router.delete('/:numResponsable', deleteResponsable); // Nouvelle route pour supprimer un responsable

module.exports = router;