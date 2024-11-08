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

  // Total des devis
const fetchTotalDevisFromDB  = async () => {
    try {
        const result = await pool.query('SELECT COUNT(*) AS total FROM devis');
        return result.rows[0].total;
    } catch (error) {
        throw error;
    }
};

// Montant moyen
const getAverageDevis = async () => {
    const query = 'SELECT AVG(montant) AS "averageMontant" FROM devis';
    
    try {
        const result = await pool.query(query);
        
        // Vérifiez la structure des résultats
        console.log('Résultat de la requête:', result.rows); // Débogage

        if (result.rows.length === 0 || result.rows[0].averageMontant === null) {
            console.warn('Aucun résultat trouvé ou valeur nulle pour averageMontant.');
            return 0; // Renvoie 0 si aucun résultat ou valeur nulle
        }

        // Assurez-vous d'utiliser le bon nom de propriété
        const averageMontant = parseFloat(result.rows[0].averageMontant);

        // Vérifiez si la conversion a réussi
        if (isNaN(averageMontant)) {
            console.warn('La valeur de averageMontant n\'est pas un nombre valide. Valeur brute:', result.rows[0].averageMontant);
            return 0; // Renvoie 0 si la conversion échoue
        }
        
        return averageMontant; // Renvoie la valeur valide
    } catch (error) {
        console.error('Erreur lors de l\'exécution de la requête:', error);
        throw new Error('Erreur de base de données'); // Lance une erreur personnalisée
    }
};

// devisModel.js
const getMinMaxDevis = async () => {
    const query = `
        SELECT MIN(montant) AS minmontant, MAX(montant) AS maxmontant
        FROM devis
    `;
    const result = await pool.query(query);
    
    // Vérifiez la structure des résultats
    // console.log('Résultat de la requête Min/Max:', result.rows); // Débogage

    // Convertissez les valeurs en nombres avant de les renvoyer
    return {
        minMontant: result.rows[0]?.minmontant ? parseFloat(result.rows[0].minmontant) : 0,
        maxMontant: result.rows[0]?.maxmontant ? parseFloat(result.rows[0].maxmontant) : 0,
    };
};



module.exports = { createDevis, getDevis, deleteDevisById, fetchTotalDevisFromDB, getAverageDevis, getMinMaxDevis };