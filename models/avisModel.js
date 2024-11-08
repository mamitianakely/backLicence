const { pool } = require('../config/database');

// créer un nouveau demande
const createAvis = async (avisData) => {
  const { numAvis, numDevis, numQuittance, dateAvis } = avisData;
  const result = await pool.query(
    'INSERT INTO "avisPaiement" ("numAvis", "numDevis", "numQuittance", "dateAvis") VALUES ($1, $2, $3, $4) RETURNING *',
    [numAvis, numDevis, numQuittance, dateAvis]
  );
  return result.rows[0];
};

// Récupérer tous les avis 
const getAvis = async () => {
  const result = await pool.query('SELECT a."numAvis", c."nomClient", a."numQuittance", a."dateAvis", d."montant", a."etat" FROM "avisPaiement" AS a JOIN devis AS d ON a."numDevis" = d."numDevis" JOIN demande AS dem ON d."numDemande" = dem."numDemande" JOIN client AS c ON dem."numChrono" = c."numChrono"');
  return result.rows;
}

//supprimer un avis
const deleteAvisById = async (numAvis) => {
  await pool.query(
    'DELETE FROM "avisPaiement" WHERE "numAvis" = $1',
    [numAvis]
  );
};


// Mettre à jour l'état d'un avis de paiement
const updateEtatAvis = async (numAvis, etat) => {
  const query = `UPDATE "avisPaiement" SET "etat" = $1 WHERE "numAvis" = $2`;
  const values = [etat, numAvis];
  await pool.query(query, values);
};

// Récupérer les informations de l'avis à partir du numAvis
const getAvisByNum = async (numAvis) => {
  const query = `SELECT "numAvis", "numQuittance" FROM "avisPaiement" WHERE "numAvis" = $1`;
  const values = [numAvis];
  const result = await pool.query(query, values);
  return result.rows[0]; // Retourne les informations de l'avis
};

// Migrer les données de l'avis vers la table permis
const migrateToPermis = async (avisData) => {
  const query = `
      INSERT INTO "permis" ("numAvis", "numQuittance", "datePermis")
      VALUES ($1, $2, CURRENT_DATE)
  `;
  const values = [avisData.numAvis, avisData.numQuittance];
  await pool.query(query, values);
};

const getAvisById = async (numAvis) => {
  try {
    const query = `
      SELECT c."nomClient", ap."numQuittance", d."lieu", dv."prixLongueur", dv."prixLargeur", dv."montant" 
	    FROM "avisPaiement" ap JOIN devis dv ON ap."numDevis" = dv."numDevis"
	    JOIN demande d ON dv."numDemande" = d."numDemande"
	    JOIN client c ON d."numChrono" = c."numChrono"
      WHERE ap."numAvis" = $1`;
    const result = await pool.query(query, [numAvis]);
    return result.rows[0];
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    throw error;
  }
};

// Fonction pour récupérer le nombre d'avis de paiement acceptés
const getCountAcceptedPaiements = async () => {
  const query = `SELECT COUNT(*) AS "acceptedCount" FROM "avisPaiement" WHERE etat = 'payé'`;
  const result = await pool.query(query);
  return parseInt(result.rows[0].acceptedCount, 10) || 0;
};

const getPaiementsByState = async () => {
  const query = `SELECT etat, COUNT(*) AS count FROM "avisPaiement" GROUP BY etat`;
  const result = await pool.query(query);
  return result.rows;
};

// Fonction pour compter le nombre total d'avis de paiement
const countTotalAvisPaiement = async () => {
  const result = await pool.query('SELECT COUNT(*) AS total FROM "avisPaiement"');
  return result.rows[0].total;
};

// Fonction pour rechercher des avis entre deux dates
const findAvisBetweenDates = async (startDate, endDate) => {
  try {
    const result = await pool.query(
      `SELECT a."numAvis", a."numQuittance", a."dateAvis", a.etat, d."montant", c."nomClient" FROM "avisPaiement" a LEFT JOIN devis d ON a."numDevis" = d."numDevis"
       LEFT JOIN demande dem ON d."numDemande" = dem."numDemande" LEFT JOIN client c ON dem."numChrono" = c."numChrono" WHERE a."dateAvis" BETWEEN $1 AND $2`,
      [startDate, endDate]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};


module.exports = { createAvis, getAvis, deleteAvisById, updateEtatAvis, getAvisByNum, migrateToPermis, 
  getAvisById,getCountAcceptedPaiements, 
  getPaiementsByState, countTotalAvisPaiement, findAvisBetweenDates };