const { pool } = require('../config/database');

// Recupérer les permis
const getPermis = async () => {
  const result = await pool.query(`SELECT permis."numPermis", client."nomClient", devis."numDevis", permis."numQuittance", permis."datePermis", 
    devis."montant", demande."lieu" FROM permis JOIN devis ON permis."numDevis" = devis."numDevis"JOIN demande ON devis."numDemande" = demande."numDemande"
    JOIN client ON demande."numChrono" = client."numChrono"`);
  return result.rows;
}

// Recuperer le permis pour le pdf
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
    const query = `SELECT SUM(d.montant) AS "montantTotal" FROM permis p JOIN "devis" d ON p."numDevis" = d."numDevis" WHERE "etat" = 'payé'`;
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
      `SELECT p."numPermis", p."numDevis", p."numQuittance", p."datePermis", c."nomClient", d.montant, e.lieu  FROM permis p
       LEFT JOIN devis d ON p."numDevis" = d."numDevis" LEFT JOIN demande e ON d."numDemande" = e."numDemande"
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

// Fonction pour obtenir la répartition des permis par taille de projet
const fetchPermisByProjectSize = async () => {
  const query = `SELECT CASE WHEN d.longueur < 50 AND d.largeur < 50 THEN 'Petit projet' WHEN d.longueur >= 50 AND d.longueur < 100 AND d.largeur >= 50 AND d.largeur < 100 THEN 'Moyen projet'
            WHEN d.longueur >= 100 AND d.largeur >= 100 THEN 'Grand projet' ELSE 'Non classifié' END AS taille_projet, COUNT(p."numPermis") AS nombre_permis
    FROM permis p JOIN devis v ON p."numDevis" = v."numDevis" JOIN demande d ON v."numDemande" = d."numDemande" GROUP BY taille_projet ORDER BY taille_projet;`;

  try {
    const result = await pool.query(query);
    return result.rows; // Retourne les résultats de la requête
  } catch (error) {
    throw error;
  }
};

module.exports = { getPermis, getTotalPermis, getMontantTotalQuittances, 
  findPermisBetweenDates, deletePermis, getPermisById, fetchPermisByProjectSize  }; 