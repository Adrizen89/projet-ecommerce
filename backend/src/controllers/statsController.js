const db = require('../config/database');

class StatsController {
    static async getCategories(req, res) {
        try {
            const [stats] = await db.execute(`
                SELECT categorie as nom, COUNT(*) as compte
                FROM products
                GROUP BY categorie
            `);
            
            res.json(stats);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
        }
    }
}

module.exports = StatsController; 