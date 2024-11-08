const express = require('express');
const { registerUser, authenticateUser } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', authenticateUser);

router.post('/register', registerUser);


// Exemple de route protégée
router.get('/', authenticateToken, (req, res) => {
    res.json({ message: `Bienvenue, ${req.user.username}` });
});

module.exports = router;
