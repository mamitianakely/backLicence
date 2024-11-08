const { pool } = require('../config/database'); 

// Créer un nouveau client
const createClient = async (clientData) => {
  const { nomClient, adresse, contact } = clientData;
  const result = await pool.query(
    'INSERT INTO client ("nomClient", "adresse", "contact") VALUES ($1, $2, $3) RETURNING *',
    [ nomClient, adresse, contact]
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

// Récupérer le nombre total de clients
const getTotalClients = async () => {
  const result = await pool.query('SELECT COUNT(*) AS total FROM client');
  return result.rows[0].total;
};

// Fonction pour obtenir la répartition des clients par zone géographique

const getClientsDistributionByRegion = async () => {
  try {
    const query = `SELECT adresse AS region, COUNT(*) AS "clientCount" FROM client GROUP BY adresse ORDER BY "clientCount" DESC;`;
    const result = await pool.query(query);
     // Log des résultats de la requête
    return result.rows;
  } catch (error) {
    console.error("Erreur lors de l'exécution de la requête SQL :", error);
    throw error;
  }
};

// Fonction pour obtenir le nombre de clients sans demande
const getClientsWithoutDemandsCount = async () => {
  try {
    const result = await pool.query(`SELECT COUNT(*) AS "clientsSansDemande" FROM client c LEFT JOIN demande d ON c."numChrono" = d."numChrono"
      WHERE d."numDemande" IS NULL;`);
    return result.rows[0].clientsSansDemande;
  } catch (error) {
    throw error;
  }
};


module.exports = { createClient, getClients, updateClient, getClientByIdFromModel, 
  deleteClientById, getTotalClients,  getClientsDistributionByRegion, getClientsWithoutDemandsCount };