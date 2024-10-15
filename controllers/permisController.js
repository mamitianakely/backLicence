const { getPermis, getPermisById } = require('../models/permisModel');
const PDFDocument = require('pdfkit');

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

        // Ajouter le contenu au PDF
        doc.fontSize(20).text(`FANOMEZAN-DALANA - LAHARANA FAHA ${permisData.numPermis} - CUF- SDU & H - 24`, { align: 'center' });
        doc.fontSize(12).text("COMMUNE URBAINE DE FIANARANTSOA", { align: 'left' });
        doc.fontSize(12).text("SERVICE DE DEVELOPPEMENT URBAIN ET HABITAT", { align: 'left' });
        doc.moveDown();

        doc.text(`Mankato : Fanorenana Trano`, { align: 'left' });
        doc.text(`Araka ny fangatahana nataon'i ${permisData.nomClient}`, { align: 'left' });
        doc.text(`Noraiketina tamin'ny ${permisData.dateDemande ? new Date(permisData.dateDemande).toLocaleDateString() : 'N/A'}, laharana- ${permisData.numPermis}`, { align: 'left' });
        doc.text(`Araka ny quittance ${permisData.numQuittance}, tamin'ny ${permisData.dateAvis ? new Date(permisData.dateAvis).toLocaleDateString() : 'N/A'}`, { align: 'left' });

        doc.text(`NY BEN'NY TANANA NY KAOMININ'I FIANARANTSOA RENIVOHITRA`, { align: 'center' });
        doc.text(`dia manome alalana an'i ${permisData.nomClient}, monina ao ${permisData.adresse}, hahazo hanorina trano mirefy ${permisData.longueur} ny halavany
            , ${permisData.largeur} ny sakany, ao amin'ny tany ${permisData.lieu}`, { align: 'left' });

        doc.moveDown();

        doc.text("Marihana fa : ", { underline: true });
        doc.text(
            "Tsy mahazo manao asa hafa ankoatr'izay nahazoany alalana ny mpangataka ary tompon'andraikitra tanteraka " +
            "amin'izay rehetra mety hitranga vokatr'izany. Omena azy ity fanomezan-dalana ity mba hampiasainy sy hanan-kery amin'izay ilàna azy.",
            { align: 'justify' });
        
        doc.moveDown();
        doc.text(`Fianarantsoa, faha ${permisData.datePermis ? new Date(permisData.datePermis).toLocaleDateString() : 'N/A', { align: 'right' }}`);

        // Terminer le document PDF
        doc.pipe(res);
        doc.end();
    } catch (error) {
        console.error("Erreur lors de la génération du PDF :", error);
        res.status(500).json({ message: 'Erreur lors de la génération du PDF.', error: error.message });
    }
}


module.exports = { getAllPermis, generatePermisPdf };