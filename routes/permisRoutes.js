const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { getAllPermis, generatePermisPdf, fetchTotalPermis, 
    getTauxApprobation, fetchMontantTotalQuittances, getPermisBetweenDates, deletePermisController } = require('../controllers/permisController');


// Applique le middleware à toutes les routes
router.use(authenticateToken);

// Route pour récupérer tous les avis
router.get('/', getAllPermis);

// Route pour générer un PDF de permis
router.get('/pdf/:numPermis', generatePermisPdf);

// Route pour obtenir le total des permis délivrés
router.get('/total-permis', fetchTotalPermis);

// Route pour obtenir le taux d'approbation des demandes de permis
router.get('/taux-approbation', getTauxApprobation);

// Route pour obtenir les montants totaux des quittances par permis
router.get('/montant-quittances', fetchMontantTotalQuittances);

// Route pour rechercher des permis entre deux dates
router.get('/search', getPermisBetweenDates);

// Route pour supprimer un permis
router.delete('/:numPermis', deletePermisController);

module.exports = router;