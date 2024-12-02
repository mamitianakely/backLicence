require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
//const path = require('path');

// Servir le dossier invoices publiquement
//app.use('/invoices', express.static(path.join(__dirname, 'invoices')));

const clientRoutes = require('./routes/clientRoutes');
const responsableRoutes = require('./routes/responsableRoutes');
const demandeRoutes = require('./routes/demandeRoutes');
const verificateurRoutes = require('./routes/verificateurRoutes');
const devisRoutes = require('./routes/devisRoutes');
const permisRoutes = require('./routes/permisRoutes');
const { connectToDatabase } = require('./config/database');

const authRoutes = require('./routes/authRoutes');

connectToDatabase();




// // Gestion des requêtes préflight (OPTIONS)
// app.options('*', (req, res) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//     res.sendStatus(204);
// });


app.use(express.json());
app.use(cors()); 

app.use('/api/clients', clientRoutes);
app.use('/api/responsables', responsableRoutes);
app.use('/api/demandes', demandeRoutes);
app.use('/api/verificateurs', verificateurRoutes);
app.use('/api/devis', devisRoutes);
app.use('/api/permis', permisRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
