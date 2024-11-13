const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByIdentifier } = require('../models/authModel');
const { pool } = require('../config/database');


const registerUser = async (req, res) => {
    const { username, password, role, fullName, email, phone } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'L\'utilisateur existe déjà' });
        }

        const newUser = await createUser(username, password, role, fullName, email, phone);
        res.status(201).json(newUser);
    } catch (error) {
        console.log("Erreur lors de l'inscription:", error);  // Ajoutez cette ligne pour loguer l'erreur
        res.status(500).json({ message: 'Erreur lors de l\'inscription' });
    }
};

const authenticateUser = async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const user = await findUserByIdentifier(identifier);
        if (!user) return res.status(401).json({ message: 'Identifiants invalides' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Identifiants invalides' });

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
        );

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};


module.exports = { registerUser, authenticateUser };
