const db = require('../config/database');

const userController = {
    getProfile: async (req, res) => {
        try {
            const userId = req.userData.userId;
            const dbConn = await db();

            const user = await dbConn.get(
                'SELECT id, email, created_at FROM users WHERE id = ?',
                [userId]
            );

            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            res.json(user);
        } catch (error) {
            console.error('Erreur getProfile:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }
};

module.exports = userController; 