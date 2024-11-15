const { pool } = require('../config/database');

// Recupérer les permis
const getPermis = async () => {
  const result = await pool.query(`SELECT permis."numPermis", client."nomClient", devis."numDevis", permis."numQuittance", permis."datePermis", 
    devis."montant", demande."lieu" FROM permis JOIN devis ON permis."numDevis" = devis."numDevis"JOIN demande ON devis."numDemande" = demande."numDemande"
    JOIN client ON demande."numChrono" = client."numChrono"`);
  return result.rows;
}

const getPermisById = async (numPermis) => {
  try {
    const query = `
        select p."numPermis", p."datePermis", c."nomClient", d."dateDemande", d."numDemande",
        p."numQuittance", c."adresse", d."longueur", d."largeur", d."lieu"
        from permis p join "devis" v on p."numDevis" = v."numDevis"
        join demande d on v."numDemande" = d."numDemande"
        join client c on d."numChrono" = c."numChrono"
        WHERE p."numPermis" = $1;
    `;
    const result = await pool.query(query, [numPermis]);
    return result.rows[0];
  } catch (error) {
    console.error('Erreur lors de la récupération du permis:', error);
    throw error;
  }
};

const getTotalPermis = async () => {
  try {
    const result = await pool.query('SELECT COUNT(*) AS total FROM permis');
    return result.rows[0].total;
  } catch (err) {
    throw err;
  }
};
const getMontantTotalQuittances = async () => {
  try {
    const query = `SELECT SUM(d.montant) AS "montantTotal" FROM permis p JOIN "avisPaiement" a ON p."numAvis" = a."numAvis" JOIN devis d ON a."numDevis" = d."numDevis"`;
    const result = await pool.query(query);
    return result.rows[0].montantTotal; // Renvoyer uniquement le montant total
  } catch (error) {
    throw error; // Propager l'erreur pour le gestionnaire d'erreurs
  }
};

// Fonction pour rechercher des permis entre deux dates
const findPermisBetweenDates = async (startDate, endDate) => {
  try {
    const result = await pool.query(
      `SELECT p."numPermis", p."numAvis", p."numQuittance", p."datePermis", c."nomClient", d.montant, e.lieu  FROM permis p
       LEFT JOIN "avisPaiement" a ON p."numAvis" = a."numAvis" LEFT JOIN devis d ON a."numDevis" = d."numDevis" LEFT JOIN demande e ON d."numDemande" = e."numDemande"
       LEFT JOIN client c ON e."numChrono" = c."numChrono" WHERE p."datePermis" BETWEEN $1 AND $2`,
      [startDate, endDate]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};

// Fonction pour supprimer un permis par son numPermis
const deletePermis = async (numPermis) => {
  const result = await pool.query(` DELETE FROM permis WHERE "numPermis" = $1 RETURNING *;
  `, [numPermis]);  // Retourne les informations du permis supprimé
  return result.rows;  // Renvoie les données du permis supprimé
};


module.exports = { getPermis, getPermisById, getTotalPermis, getMontantTotalQuittances, findPermisBetweenDates, deletePermis }; 