const express= require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { addDevis, getAllDevis, deleteDevis, getTotalDevis, fetchAverageDevis, fetchMinMaxDevis } = require('../controllers/devisController');

// Applique le middleware à toutes les routes
router.use(authenticateToken);

//routes pour ajouter un devis
router.post('/', addDevis);

// Route pour récupérer tous les devis
router.get('/', getAllDevis);

// Route pour supprimer un devis
router.delete('/:numDevis', deleteDevis); // Nouvelle route pour supprimer un client

// Route pour obtenir le nombre total de devis générés
router.get('/total-devis', getTotalDevis);

// Route pour obtenir le montant moyen des devis
router.get('/average', fetchAverageDevis);

// Route pour min et max de devis
router.get('/minmax', fetchMinMaxDevis);


module.exports = router;