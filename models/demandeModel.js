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

// Fonction pour obtenir le nombre de demandes en attente de devis
const getCountOfDemandsAwaitingDevisFromDB = async () => {
  try {
    const result = await pool.query(`
      SELECT COUNT(*) AS "demandsAwaitingDevisCount"
      FROM demande
      WHERE "numDemande" NOT IN (SELECT "numDemande" FROM devis)
    `);
    return result.rows[0].demandsAwaitingDevisCount;
  } catch (error) {
    console.error("Erreur lors de la récupération du nombre de demandes en attente de devis:", error);
    throw error;
  }
};

const getConversionRateFromDB = async () => {
  try {
    const result = await pool.query(`
      SELECT
        (COUNT(DISTINCT dev."numDevis") * 100.0 / NULLIF(COUNT(DISTINCT d."numDemande"), 0)) AS "conversionRate"
      FROM
        demande d
        LEFT JOIN devis dev ON d."numDemande" = dev."numDemande";
    `);
    return result.rows[0].conversionRate;
  } catch (error) {
    console.error("Erreur lors de la récupération du taux de conversion:", error);
    throw error;
  }
};

// Fonction pour obtenir le nombre de demandes ayant un avis de paiement
const getDemandsWithAvisCount = async () => {
  const query = `SELECT COUNT(*) AS total_with_avis FROM demande WHERE "numDemande" IN (SELECT d."numDemande"
      FROM demande d JOIN devis dv ON d."numDemande" = dv."numDemande" JOIN "avisPaiement" av ON dv."numDevis" = av."numDevis");`;
  const result = await pool.query(query);
  return parseInt(result.rows[0].total_with_avis, 10);
};

// Fonction pour calculer le pourcentage des demandes avec un avis de paiement
const calculateDemandsWithAvisPercentage = async () => {
  const totalWithAvis = await getDemandsWithAvisCount();
  const totalDemandes = await getTotalDemandesFromDB();

  const percentage = (totalWithAvis / totalDemandes) * 100;
  return percentage;
};

// Fonction pour rechercher des demandes entre deux dates
const findDemandsBetweenDates = async (startDate, endDate) => {
  try {
    const result = await pool.query(
      `SELECT d."numDemande", d."dateDemande", d."typeDemande", d."longueur", d."largeur", d."lieu", 
      c."nomClient" FROM demande d LEFT JOIN client c ON d."numChrono" = c."numChrono" WHERE d."dateDemande" BETWEEN $1 AND $2`,
      [startDate, endDate]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};


module.exports = { createDemande, getDemandes, getDemandeByIdFromModel, updateDemande, deleteDemandeById, 
  getPendingDemandesCount, getDemandesByTypeAndMonth, getDemandesByMonth, findDemandsBetweenDates,
  getTotalDemandesFromDB, getCountOfDemandsAwaitingDevisFromDB, getConversionRateFromDB, calculateDemandsWithAvisPercentage };