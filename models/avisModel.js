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


module.exports = { createAvis, getAvis, deleteAvisById, updateEtatAvis, getAvisByNum, migrateToPermis };