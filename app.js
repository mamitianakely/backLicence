require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const clientRoutes = require('./routes/clientRoutes');
const responsableRoutes = require('./routes/responsableRoutes');
const demandeRoutes = require('./routes/demandeRoutes');
const verificateurRoutes = require('./routes/verificateurRoutes');
//const avisRoutes = require('./routes/avisRoutes');
const devisRoutes = require('./routes/devisRoutes');
const permisRoutes = require('./routes/permisRoutes');
const { connectToDatabase } = require('./config/database');

const authRoutes = require('./routes/authRoutes');


app.use(express.json()); // Pour parser les JSON dans les requêtes
connectToDatabase();     // Connexion à PostgreSQL


app.use(cors());


// const corsOptions = {
//     origin: ['http://localhost:5000'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true,
//     optionsSuccessStatus: 200
//   };
// app.use(cors(corsOptions));
// Utiliser les routes
//app.use('/api/permits', permitRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/responsables', responsableRoutes);
app.use('/api/demandes', demandeRoutes);
app.use('/api/verificateurs', verificateurRoutes);
//app.use('/api/avis', avisRoutes);
app.use('/api/devis', devisRoutes);
app.use('/api/permis', permisRoutes);

// Utilisation des routes d'authentification
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
