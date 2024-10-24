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

module.exports = { getPermis, getPermisById }; 