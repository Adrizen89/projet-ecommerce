const db = require('../config/database');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Seules les images sont autorisées'));
    }
}).array('images', 5);

const productController = {
    getAllProducts: async (req, res) => {
        try {
            const { search, category, sort } = req.query;
            const dbConn = await db();
            
            let query = 'SELECT * FROM products';
            const params = [];
            
            // Construire la clause WHERE pour la recherche et le filtrage
            const whereConditions = [];
            if (search) {
                whereConditions.push('(libelle LIKE ? OR description LIKE ?)');
                params.push(`%${search}%`, `%${search}%`);
            }
            if (category) {
                whereConditions.push('categorie = ?');
                params.push(category);
            }
            
            if (whereConditions.length > 0) {
                query += ' WHERE ' + whereConditions.join(' AND ');
            }
            
            // Ajouter le tri
            if (sort) {
                switch (sort) {
                    case 'prix-asc':
                        query += ' ORDER BY prix ASC';
                        break;
                    case 'prix-desc':
                        query += ' ORDER BY prix DESC';
                        break;
                    case 'nom-asc':
                        query += ' ORDER BY libelle ASC';
                        break;
                    case 'nom-desc':
                        query += ' ORDER BY libelle DESC';
                        break;
                }
            }
            
            const products = await dbConn.all(query, params);
            res.json(products);
        } catch (error) {
            console.error('Erreur getAllProducts:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    },

    getUserProducts: async (req, res) => {
        try {
            const userId = req.userData.userId;
            const dbConn = await db();
            
            const products = await dbConn.all(
                'SELECT * FROM products WHERE user_id = ?',
                [userId]
            );
            
            res.json(products);
        } catch (error) {
            console.error('Erreur getUserProducts:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    },

    getProductById: async (req, res) => {
        try {
            const { id } = req.params;
            const dbConn = await db();
            
            const product = await dbConn.get(
                'SELECT * FROM products WHERE id = ?',
                [id]
            );
            
            if (!product) {
                return res.status(404).json({ message: 'Produit non trouvé' });
            }
            
            res.json(product);
        } catch (error) {
            console.error('Erreur getProductById:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    },

    createProduct: async (req, res) => {
        try {
            const { libelle, description, prix, categorie, stock } = req.body;
            const userId = req.userData.userId;
            const dbConn = await db();
            
            const result = await dbConn.run(
                'INSERT INTO products (libelle, description, prix, categorie, stock, user_id) VALUES (?, ?, ?, ?, ?, ?)',
                [libelle, description, prix, categorie, stock, userId]
            );
            
            res.status(201).json({
                message: 'Produit créé avec succès',
                productId: result.lastID
            });
        } catch (error) {
            console.error('Erreur createProduct:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    },

    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const { libelle, description, prix, categorie, stock } = req.body;
            const userId = req.userData.userId;
            const dbConn = await db();
            
            // Vérifier que l'utilisateur est propriétaire du produit
            const product = await dbConn.get(
                'SELECT * FROM products WHERE id = ? AND user_id = ?',
                [id, userId]
            );
            
            if (!product) {
                return res.status(404).json({ message: 'Produit non trouvé ou non autorisé' });
            }
            
            await dbConn.run(
                'UPDATE products SET libelle = ?, description = ?, prix = ?, categorie = ?, stock = ? WHERE id = ?',
                [libelle, description, prix, categorie, stock, id]
            );
            
            res.json({ message: 'Produit mis à jour avec succès' });
        } catch (error) {
            console.error('Erreur updateProduct:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.userData.userId;
            const dbConn = await db();
            
            // Vérifier que l'utilisateur est propriétaire du produit
            const result = await dbConn.run(
                'DELETE FROM products WHERE id = ? AND user_id = ?',
                [id, userId]
            );
            
            if (result.changes === 0) {
                return res.status(404).json({ message: 'Produit non trouvé ou non autorisé' });
            }
            
            res.json({ message: 'Produit supprimé avec succès' });
        } catch (error) {
            console.error('Erreur deleteProduct:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    },

    getStats: async (req, res) => {
        try {
            const dbConn = await db();
            const stats = await dbConn.all(
                'SELECT categorie, COUNT(*) as compte FROM products GROUP BY categorie'
            );
            res.json(stats);
        } catch (error) {
            console.error('Erreur getStats:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }
};

module.exports = productController; 