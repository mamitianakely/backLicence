const { pool } = require('../config/database');

// créer un nouveau demande
const createDemande = async (demandeData) => {
    const { numChrono, dateDemande, typeDemande, longueur, largeur, lieu } = demandeData;
    const result = await pool.query(
      'INSERT INTO demande ("numChrono", "dateDemande", "typeDemande", "longueur", "largeur", "lieu") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [numChrono, dateDemande, typeDemande, longueur, largeur, lieu]
    );
    return result.rows[0];
  };

// Récupérer tous les demandes
const getDemandes = async () => {
  const result = await pool.query('SELECT demande."numDemande", client."nomClient", demande."dateDemande", demande."typeDemande", demande."longueur", demande."largeur", demande."lieu" FROM client INNER JOIN demande ON client."numChrono" = demande."numChrono"');
  return result.rows;
};

// Récupérer un client spécifique
const getDemandeByIdFromModel = async (numDemande) => {
  const result = await pool.query(
    'SELECT * FROM demande WHERE "numDemande" = $1',
    [numDemande]
  );
  return result.rows[0];
};

// Mettre à jour un demande existant
const updateDemande = async (numDemande, demandeData) => {
  const { dateDemande, typeDemande, longueur, largeur, lieu } = demandeData;
  const result = await pool.query(
    'UPDATE demande SET "dateDemande" = $1, "typeDemande" = $2, "longueur" = $3, "largeur" = $4, "lieu" = $5 WHERE "numDemande" = $6 RETURNING *',
    [dateDemande, typeDemande, longueur, largeur,lieu, numDemande]
  );
  return result.rows[0];
};

// Supprimer un demande existant
const deleteDemandeById = async (numDemande) => {
  await pool.query(
    'DELETE FROM demande WHERE "numDemande" = $1',
    [numDemande]
  );
};


// Récupérer le nombre de demandes en attente (non associées à un devis)
const getPendingDemandesCount = async () => {
  const result = await pool.query(
    'SELECT COUNT(*) FROM demande d LEFT JOIN devis v ON d."numDemande" = v."numDemande" WHERE v."numDevis" IS NULL'
  );
  return result.rows[0].count;
};

// Récupérer le nombre de demandes par type de permis pour chaque mois
const getDemandesByTypeAndMonth = async () => {
  const result = await pool.query(`SELECT EXTRACT(MONTH FROM "dateDemande") AS month, "typeDemande", COUNT(*) AS count FROM demande
    GROUP BY month, "typeDemande" ORDER BY month, "typeDemande";
  `);
  return result.rows;
};

const getDemandesByMonth = async () => {
  const query = `SELECT TO_CHAR("dateDemande", 'YYYY-MM') AS month, COUNT(*) AS total FROM demande GROUP BY month ORDER BY month;`;
  try {
      const result = await pool.query(query);
      return result.rows;
  } catch (error) {
      throw new Error('Error fetching demandes by month: ' + error.message);
  }
};

// Fonction pour obtenir le nombre total de demandes
const getTotalDemandesFromDB = async () => {
  const query = 'SELECT COUNT(*) AS total FROM demande'; // Assurez-vous que 'demande' est le bon nom de la table
  try {
      const result = await pool.query(query);
      console.log('Résultat de la requête:', result.rows);
      return parseInt(result.rows[0].total, 10);
  } catch (error) {
      console.error('Erreur lors de l’exécution de la requête SQL:', error);
      throw error; // Propager l’erreur pour le gestionnaire dans le contrôleur
  }
};

module.exports = { createDemande, getDemandes, getDemandeByIdFromModel, updateDemande, deleteDemandeById, 
  getPendingDemandesCount, getDemandesByTypeAndMonth, getDemandesByMonth, getTotalDemandesFromDB };