const express= require('express');
const router = express.Router();
const { addDevis, getAllDevis, deleteDevis } = require('../controllers/devisController');

//routes pour ajouter un devis
router.post('/', addDevis);

// Route pour récupérer tous les devis
router.get('/', getAllDevis);

// Route pour supprimer un devis
router.delete('/:numDevis', deleteDevis); // Nouvelle route pour supprimer un client


module.exports = router;