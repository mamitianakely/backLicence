const { pool } = require('../config/database');

// créer un nouveau verificateur
const createVerificateur = async (verificateurData) => {
    const { numVerificateur, nomVerificateur, dateDescente } = verificateurData;
    const result = await pool.query(
        'INSERT INTO verificateur ("numVerificateur", "nomVerificateur", "dateDescente")VALUES ($1, $2, $3) RETURNING *',
        [numVerificateur, nomVerificateur, dateDescente]
    );
    return result.rows[0]
}

//Recuperer tous les verificateurs
const getVerificateurs = async () => {
    const result = await pool.query('SELECT * FROM verificateur');
    return result.rows;
}

// Recuperer un verificateur existant
const getVerificateurByIdFromModel = async (numVerificateur) => {
    const result = await pool.query(
        'SELECT * FROM verificateur WHERE "numVerificateur" = $1',
        [numVerificateur]
    );
    return result.rows[0];
};

// Mettre à jour un verificateur
const updateVerificateur = async (numVerificateur, verificateurData) => {
    const {nomVerificateur, dateDescente} = verificateurData;
    const result = await pool.query(
        'UPDATE verificateur SET "nomVerificateur" = $1, "dateDescente" = $2 WHERE "numVerificateur" = $3',
        [nomVerificateur, dateDescente, numVerificateur]
    );
    return result.rows[0];
};

//supprimer un verificateur existant
const deleteVerificateurById = async (numVerificateur) => {
    await pool.query(
        'DELETE FROM verificateur WHERE "numVerificateur" = $1',
        [numVerificateur]
    )
};


module.exports = { createVerificateur, getVerificateurs, getVerificateurByIdFromModel, updateVerificateur, deleteVerificateurById };