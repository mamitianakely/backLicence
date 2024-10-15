const express = require('express');
const router = express.Router();
const { getAllPermis, generatePermisPdf } = require('../controllers/permisController');


// Route pour récupérer tous les avis
router.get('/', getAllPermis);

// Route pour générer un PDF de permis
router.get('/pdf/:numPermis', generatePermisPdf);

module.exports = router;