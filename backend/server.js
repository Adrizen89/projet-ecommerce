const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./src/routes');
const app = express();

// Configuration de base
app.use(express.json());

// Configuration CORS avec options spécifiques
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));

// Configuration Helmet avec CSP personnalisé
app.use(helmet({
    contentSecurityPolicy: false, // Désactivé pour le développement
    crossOriginEmbedderPolicy: false
}));

// Routes API
app.use('/api', routes);

// Route pour les statistiques (accessible à tous)
app.get('/api/stats', (req, res) => {
    // Cette route sera accessible sans restriction CORS
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = app; 