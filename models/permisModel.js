const { pool } = require('../config/database');

// Recupérer les permis
const getPermis = async () => {
  const result = await pool.query('SELECT p."numPermis", c."nomClient", a."numAvis", a."numQuittance", CURRENT_DATE AS "datePermis", dv.montant, d.lieu FROM permis p JOIN "avisPaiement" a ON p."numAvis" = a."numAvis" JOIN devis dv ON a."numDevis" = dv."numDevis" JOIN demande d ON dv."numDemande" = d."numDemande" JOIN client c ON d."numChrono" = c."numChrono" WHERE p."numPermis" IS NOT NULL');
  return result.rows;
}

const getPermisById = async (numPermis) => {
  try {
    const query = `
        select p."numPermis", p."datePermis", c."nomClient", d."dateDemande", a."dateAvis",
        a."numQuittance", c."adresse", d."longueur", d."largeur", d."lieu"
        from permis p join "avisPaiement" a on p."numAvis" = a."numAvis"
        join devis v on a."numDevis" = v."numDevis"
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


module.exports = { getPermis, getPermisById, getTotalPermis, getMontantTotalQuittances, findPermisBetweenDates }; 