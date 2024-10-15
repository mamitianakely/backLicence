const { pool } = require('../config/database'); 

// Créer un nouveau client
const createClient = async (clientData) => {
  const { numChrono, nomClient, adresse, contact } = clientData;
  const result = await pool.query(
    'INSERT INTO client ("numChrono", "nomClient", "adresse", "contact") VALUES ($1, $2, $3, $4) RETURNING *',
    [numChrono, nomClient, adresse, contact]
  );
  return result.rows[0];
};

// Récupérer tous les clients
const getClients = async () => {
  const result = await pool.query('SELECT * FROM client');
  return result.rows;
};

// Récupérer un client spécifique
const getClientByIdFromModel = async (numChrono) => {
  const result = await pool.query(
    'SELECT * FROM client WHERE "numChrono" = $1', 
    [numChrono]
  );
  return result.rows[0];
};

// Mettre à jour un client existant
const updateClient = async (numChrono, clientData) => {
  const { nomClient, adresse, contact } = clientData;
  const result = await pool.query(
    'UPDATE client SET "nomClient" = $1, "adresse" = $2, "contact" = $3 WHERE "numChrono" = $4 RETURNING *',
    [nomClient, adresse, contact, numChrono]
  );
  return result.rows[0];
};

// Supprimer un client existant
const deleteClientById = async (numChrono) => {
  await pool.query(
    'DELETE FROM client WHERE "numChrono" = $1',
    [numChrono]
  );
};


module.exports = { createClient, getClients, updateClient, getClientByIdFromModel, deleteClientById };