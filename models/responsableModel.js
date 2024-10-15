const { pool } = require('../config/database');

//créer un nouveau responsable
const createResponsable = async (responsableData) => {
    const { numResponsable, nomResponsable, motDePasse } = responsableData;
    const result = await pool.query(
      'INSERT INTO responsable ("numResponsable", "nomResponsable", "motDePasse") VALUES ($1, $2, $3) RETURNING *',
      [numResponsable, nomResponsable, motDePasse]
    );
    return result.rows[0];
  };

// Récupérer tous les responsables
const getResponsables = async () => {
  const result = await pool.query('SELECT * FROM responsable');
  return result.rows;
};

// Récupérer un responsable spécifique
const getResponsableByIdFromModel = async (numResponsable) => {
  const result = await pool.query(
    'SELECT * FROM responsable WHERE "numResponsable" = $1', 
    [numResponsable]
  );
  return result.rows[0];
};

// Mettre à jour un responsable existant
const updateResponsable = async (numResponsable, responsableData) => {
  const { nomResponsable, motDePasse } = responsableData;
  const result = await pool.query(
    'UPDATE responsable SET "nomResponsable" = $1, "motDePasse" = $2 WHERE "numResponsable" = $3 RETURNING *',
    [nomResponsable, motDePasse, numResponsable]
  );
  return result.rows[0];
};

// Supprimer un responsable existant
const deleteResponsableById = async (numResponsable) => {
  await pool.query(
    'DELETE FROM responsable WHERE "numResponsable" = $1',
    [numResponsable]
  );
};

module.exports = { createResponsable, getResponsables, getResponsableByIdFromModel, updateResponsable, deleteResponsableById };