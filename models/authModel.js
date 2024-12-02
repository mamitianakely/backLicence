const pool = require('../config/database').pool; 
const bcrypt = require('bcryptjs');

// Fonction pour créer un utilisateur avec hachage de mot de passe
const createUser = async (username, password, role, fullName, email, phone) => {
    const hashedPassword = await bcrypt.hash(password, 10); // Hachage du mot de passe
    const query = `
        INSERT INTO users (username, password, role, full_name, email, phone)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [username, hashedPassword, role, fullName, email, phone];

    const { rows } = await pool.query(query, values); // Utilisation de pool pour la requête
    return rows[0];
};

// Fonction pour trouver un utilisateur par son nom d'utilisateur
const findUserByIdentifier = async (identifier) => {
    const query = `
        SELECT * FROM users 
        WHERE username = $1 OR email = $1
    `;
    const result = await pool.query(query, [identifier]);
    return result.rows[0];
};


module.exports = { createUser, findUserByIdentifier };
