const { pool } = require('../config/database');

// créer un nouveau Devis
const createDevis = async (devisData) => {
    const { numDemande, prixLongueur, prixLargeur, montant } = devisData;
    try {
        const result = await pool.query(
            'INSERT INTO devis ("numDemande", "prixLongueur", "prixLargeur", "montant") VALUES ($1, $2, $3, $4) RETURNING "numDevis"',
            [numDemande, prixLongueur, prixLargeur, montant]
        );
        return result.rows[0].numDevis;
    } catch (error) {
        console.error('Erreur lors de l\'insertion dans la base de données:', error);
        throw error; // Propager l'erreur pour la gestion dans le contrôleur
    }
};

// Récupérer tous les devis 
const getDevis = async () => {
    const result = await pool.query('SELECT devis."numDevis", client."nomClient", devis."prixLongueur", devis."prixLargeur", devis."montant", devis."etat" FROM devis JOIN demande ON devis."numDemande" = demande."numDemande" JOIN client ON demande."numChrono" = client."numChrono"');
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

// Mise à jour de l'état du devis
// Mettre à jour l'état du devis à "payé"
const updateDevisStateToPaid = async (numDevis) => {
    const query = `UPDATE devis SET etat = 'payé' WHERE "numDevis" = $1 RETURNING *`;
    try {
      const result = await pool.query(query, [numDevis]);
      return result.rows[0]; // Retourne le devis mis à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour du devis:", error);
      throw error;
    }
  };
  
//   // Ajout dans la table permis
// Fonction pour créer un permis
const createPermis = async (numDevis, numQuittance, datePermis) => {
    const query = 'INSERT INTO permis ("numDevis", "numQuittance", "datePermis") VALUES ($1, $2, $3) RETURNING *';
    const result = await pool.query(query, [numDevis, numQuittance, datePermis]);
    return result.rows[0];
};


// Récupérer les informations d'un devis à partir de son ID
const getDevisById = async (numDevis) => {
    const query = `
        SELECT v."numDevis", d."numDemande", c."nomClient", d."typeDemande", d."dateDemande", d."lieu", v."prixLongueur", v."prixLargeur", v."montant" 
       FROM demande d JOIN client c ON d."numChrono" = c."numChrono" JOIN devis v ON d."numDemande" = v."numDemande" WHERE v."numDevis" = $1 AND v.etat = 'non payé'
    `;
    const { rows } = await pool.query(query, [numDevis]);
    return rows[0]; // Retourne un seul résultat
};

// demande par état de devis
const getDemandsByDevisState = async () => {
    const query = `SELECT d.etat, COUNT(*) AS total FROM devis d JOIN demande dm ON d."numDemande" = dm."numDemande" GROUP BY d.etat;`;
    const result = await pool.query(query);
    return result.rows;
  };

// Récupérer la liste des devis triés par nomClient
const getDevisSortedByClientName = async () => {
    try {
        const result = await pool.query(`
            SELECT devis."numDevis", client."nomClient", devis."prixLongueur", devis."prixLargeur", devis."montant", devis."etat"
            FROM devis JOIN demande ON devis."numDemande" = demande."numDemande" JOIN client ON demande."numChrono" = client."numChrono"
            ORDER BY client."nomClient" DESC;
        `);
        return result.rows;
    } catch (err) {
        console.error('Error fetching sorted devis:', err);
        throw err;
    }
};

// Fonction pour récupérer les devis avec l'information du permis et du client
const fetchDevisWithPermisAndClient = async () => {
    try {
        // console.log('Lancement de la requête pour récupérer les devis avec permis et client');
        const result = await pool.query(`
            SELECT d."numDevis", d."numDemande", d."prixLongueur", d."prixLargeur", 
                   d."montant", d."etat", 
                   c."nomClient",  -- Ajout du nomClient depuis la table client
                   CASE 
                       WHEN p."numPermis" IS NOT NULL THEN true
                       ELSE false
                   END AS "hasPermis"
            FROM devis d
            LEFT JOIN permis p ON d."numDevis" = p."numDevis"
            LEFT JOIN demande dem ON dem."numDemande" = d."numDemande"  -- Jointure avec la table demande
            LEFT JOIN client c ON c."numChrono" = dem."numChrono"; 
        `);
        // console.log('Résultat de la requête:', result.rows);
        return result.rows; // Retourner les devis avec les informations sur le permis et le client
    } catch (error) {
        console.error('Erreur lors de la récupération des devis:', error);
        throw error;
    }
};

module.exports = { createDevis, getDevis, deleteDevisById, fetchTotalDevisFromDB, getAverageDevis, getMinMaxDevis, 
    updateDevisStateToPaid, createPermis, getDevisById, getDemandsByDevisState, getDevisSortedByClientName, fetchDevisWithPermisAndClient
 };