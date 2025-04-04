const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'VOTRE_SECRET_TEMPORAIRE';
const JWT_EXPIRES_IN = '24h';

const authController = {
    register: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email et mot de passe requis' });
            }

            const dbConn = await db();
            
            // Vérifier si l'utilisateur existe déjà
            const existingUser = await dbConn.get('SELECT id FROM users WHERE email = ?', [email]);
            if (existingUser) {
                return res.status(400).json({ message: 'Cet email est déjà utilisé' });
            }

            // Hasher le mot de passe
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insérer le nouvel utilisateur
            const result = await dbConn.run(
                'INSERT INTO users (email, password) VALUES (?, ?)',
                [email, hashedPassword]
            );

            res.status(201).json({ 
                message: 'Utilisateur créé avec succès',
                userId: result.lastID 
            });

        } catch (error) {
            console.error('Erreur register:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email et mot de passe requis' });
            }

            const dbConn = await db();
            const user = await dbConn.get('SELECT * FROM users WHERE email = ?', [email]);

            if (!user) {
                return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            }

            const token = jwt.sign(
                { userId: user.id },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            res.json({
                token,
                userId: user.id,
                message: 'Connexion réussie'
            });

        } catch (error) {
            console.error('Erreur login:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }
};

module.exports = authController; 