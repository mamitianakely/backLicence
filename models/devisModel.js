const { pool } = require('../config/database');

// créer un nouveau Devis
const createDevis = async (devisData) => {
    const { numDevis, numDemande, prixLongueur, prixLargeur, montant } = devisData;
    try {
        const result = await pool.query(
            'INSERT INTO devis ("numDevis", "numDemande", "prixLongueur", "prixLargeur", "montant") VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [numDevis, numDemande, prixLongueur, prixLargeur, montant]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Erreur lors de l\'insertion dans la base de données:', error);
        throw error; // Propager l'erreur pour la gestion dans le contrôleur
    }
};

// Récupérer tous les devis 
const getDevis = async () => {
    const result = await pool.query('SELECT devis."numDevis", client."nomClient", devis."prixLongueur", devis."prixLargeur", devis."montant" FROM devis JOIN demande ON devis."numDemande" = demande."numDemande" JOIN client ON demande."numChrono" = client."numChrono"');
    return result.rows;
}


// Supprimer un devis
const deleteDevisById = async (numDevis) => {
    await pool.query(
      'DELETE FROM devis WHERE "numDevis" = $1',
      [numDevis]
    );
  };

module.exports = { createDevis, getDevis, deleteDevisById };