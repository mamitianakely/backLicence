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


module.exports = { createDemande, getDemandes, getDemandeByIdFromModel, updateDemande, deleteDemandeById };