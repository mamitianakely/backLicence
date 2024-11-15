const { getPermis, getPermisById, getTotalPermis, getMontantTotalQuittances, findPermisBetweenDates, deletePermis } = require('../models/permisModel');
const { getTotalDemandesFromDB } = require('../models/demandeModel');
const PDFDocument = require('pdfkit');
const path = require('path');

// Récupérer tous les permis
const getAllPermis = async (req, res) => {
    try {
        const avis = await getPermis();
        res.json(avis);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const generatePermisPdf = async (req, res) => {
    const { numPermis } = req.params;

    try {
        const permisData = await getPermisById(numPermis);

        if (!permisData) {
            return res.status(404).json({ message: 'Permis non trouvé.' });
        }

        // Création d'un nouveau document PDF
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=permis-${numPermis}.pdf`);


        const madaCenterPath = path.join(__dirname, './assets/mada.jpg');

        // Définir une largeur plus grande pour l'image au centre
        const pageWidth = doc.page.width;
        const imageWidth = 200; // Largeur de l'image
        const centerX = (pageWidth - imageWidth) / 2; // Calculer la position X pour centrer l'image

        // Ajouter l'image au centre en haut
        doc.image(madaCenterPath, centerX, 40, { width: imageWidth });
        doc.moveDown(6); // Ajustement de l'espacement entre l'image et le logo

        const logoLeftPath = path.join(__dirname, './assets/logo.jpg');

        // Ajouter le logo à gauche
        doc.image(logoLeftPath, 40, 100, { width: 60 }); // Positionner le logo à gauche
        doc.moveDown(1); // Espacement entre le logo et le texte

        
        // Positionner le contenu à gauche (Commune Urbaine)
        const sameLevelY = 160; // Y pour aligner logo et texte de gauche
        doc.fontSize(14).font('Helvetica-Bold').text("COMMUNE URBAINE DE", 40, sameLevelY, { align: 'left' });
        doc.fontSize(14).font('Helvetica-Bold').text("FIANARANTSOA", 40, sameLevelY + 15, { align: 'left' });
        doc.fontSize(10).font('Helvetica-Bold').text("----------------------", 40, sameLevelY + 30, { align: 'left' });
        doc.fontSize(10).font('Helvetica-Oblique').text("SERVICE DE DEVELOPPEMENT", 40, sameLevelY + 45, { align: 'left' });
        doc.fontSize(10).font('Helvetica-Oblique').text("URBAIN ET HABITAT", 40, sameLevelY + 60, { align: 'left' });
        doc.fontSize(10).font('Helvetica-Bold').text("----------------------", 40, sameLevelY + 75, { align: 'left' });

        doc.moveDown(6); // Espacement supplémentaire

        // Définir une nouvelle position Y pour le contenu suivant juste en dessous
        const newSectionStartY = sameLevelY + 85; // Début de la nouvelle section

        // Titre en gras et centré
        doc.fontSize(14).font('Helvetica-Bold').text("NY BEN'NY TANANA NY KAOMININ'I FIANARANTSOA RENIVOHITRA", { align: 'center' });
        doc.moveDown(1); // Espacement supplémentaire

        // Texte principal en pleine largeur
        const mainTextWidth = pageWidth - 80; // Largeur totale de la page moins les marges
        doc.fontSize(12).font('Helvetica').text(
            `dia manome alalana an'i ${permisData.nomClient}, monina ao ${permisData.adresse}, hahazo hanorina trano mirefy ${permisData.longueur} ny halavany, ` +
            `${permisData.largeur} ny sakany, ao amin'ny tany ${permisData.lieu}`,
            { align: 'justify', width: mainTextWidth } // Ajustement de la largeur
        );

        // Section "Marihana fa" en pleine largeur
        doc.moveDown(1.5); // Espacement pour le texte principal
        doc.fontSize(12).font('Helvetica-Bold').text("Marihana fa : ", { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12).font('Helvetica').text(
            "Tsy mahazo manao asa hafa ankoatr'izay nahazoany alalana ny mpangataka ary tompon'andraikitra tanteraka " +
            "amin'izay rehetra mety hitranga vokatr'izany. Omena azy ity fanomezan-dalana ity mba hampiasainy sy hanan-kery amin'izay ilàna azy.",
            { align: 'justify', width: mainTextWidth } // Ajustement de la largeur
        );

        doc.moveDown(2); // Ajouter de l'espace

        // Date finale alignée à droite
        const formattedDatePermis = permisData.datePermis ? new Date(permisData.datePermis).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A';
        doc.fontSize(12).font('Helvetica').text(`Fianarantsoa, faha ${formattedDatePermis}`, { align: 'right' });




        // Positionner le contenu à droite (FANOMEZAN-DALANA) au même niveau que le logo
        const rightTextX = 300; // Position X pour le texte à droite
        doc.fontSize(12).font('Helvetica-Bold').text("FANOMEZAN-DALANA", rightTextX, sameLevelY, { align: 'left' });
        doc.fontSize(12).font('Helvetica-Bold').text(`N°${permisData.numDemande} - CUF- SDU & H - 24`, rightTextX, sameLevelY + 20, { align: 'left' });
        doc.fontSize(12).font('Helvetica-Bold').text("Mankato : FANORENANA TRANO", rightTextX, sameLevelY + 40, { align: 'left' });
        doc.fontSize(12).font('Helvetica').text(`Araka ny fangatahana nataon'i ${permisData.nomClient} Noraiketina tamin'ny ${new Date(permisData.dateDemande).toLocaleDateString('fr-FR')}, , laharana- ${permisData.numPermis} Araka ny quittance ${permisData.numQuittance}, tamin'ny ${new Date(permisData.datePermis).toLocaleDateString('fr-FR')}`, rightTextX, sameLevelY + 60, { align: 'left' });
        doc.moveDown(2);

        // Terminer le document PDF
        doc.pipe(res);
        doc.end();


    } catch (error) {
        console.error("Erreur lors de la génération du PDF :", error);
        res.status(500).json({ message: 'Erreur lors de la génération du PDF.', error: error.message });
    }
};

const fetchTotalPermis = async (req, res) => {
    try {
        const total = await getTotalPermis();
        res.json({ total });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Fonction pour calculer le taux d'approbation
const getTauxApprobation = async (req, res) => {
    try {
        const totalDemandes = await getTotalDemandesFromDB(); // Utilisation de la fonction existante
        const totalPermis = await getTotalPermis();
        
        // Calcul du taux d'approbation (en pourcentage)
        const tauxApprobation = totalDemandes > 0 ? (totalPermis / totalDemandes) * 100 : 0;

        res.status(200).json({
            totalDemandes,
            totalPermis,
            tauxApprobation: tauxApprobation.toFixed(2) // Retourner avec deux décimales
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération du taux d\'approbation' });
    }
};

const fetchMontantTotalQuittances = async (req, res) => {
    try {
        const montantTotalQuittances = await getMontantTotalQuittances();
        res.status(200).json({ montantTotalQuittances }); // Cela devrait être correct
    } catch (error) {
        console.error("Erreur lors de la récupération du montant total des quittances:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

// Contrôleur pour rechercher des permis entre deux dates
const getPermisBetweenDates = async (req, res) => {
    const { startDate, endDate } = req.query;
  
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Les dates de début et de fin sont requises." });
    }
  
    try {
      const permis = await findPermisBetweenDates(startDate, endDate);
      res.status(200).json(permis);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Erreur serveur lors de la récupération des permis." });
    }
  };

  // Fonction pour supprimer un permis
const deletePermisController = async (req, res) => {
    const { numPermis } = req.params;  // Récupérer le numPermis à partir des paramètres de la route
  
    try {
      // Appeler le modèle pour supprimer le permis
      const deletedPermis = await deletePermis(numPermis);
  
      if (deletedPermis.length === 0) {
        return res.status(404).json({ message: 'Permis non trouvé' });  // Si aucun permis n'est trouvé
      }
  
      res.json({ message: 'Permis supprimé avec succès', data: deletedPermis });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la suppression du permis' });
    }
  };
  


module.exports = { getAllPermis, generatePermisPdf, fetchTotalPermis, getTauxApprobation, 
    fetchMontantTotalQuittances, getPermisBetweenDates, deletePermisController };