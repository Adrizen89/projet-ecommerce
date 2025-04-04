const db = require('../config/database');

const cartController = {
    // Ajouter au panier
    addToCart: async (req, res) => {
        try {
            const { productId, quantity } = req.body;
            const userId = req.userData.userId;
            const dbConn = await db();

            // Vérifier si le produit existe et a assez de stock
            const product = await dbConn.get(
                'SELECT * FROM products WHERE id = ?',
                [productId]
            );

            if (!product) {
                return res.status(404).json({ message: 'Produit non trouvé' });
            }

            if (product.stock < quantity) {
                return res.status(400).json({ message: 'Stock insuffisant' });
            }

            // Vérifier si le produit est déjà dans le panier
            const existingItem = await dbConn.get(
                'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
                [userId, productId]
            );

            if (existingItem) {
                // Mettre à jour la quantité
                await dbConn.run(
                    'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
                    [quantity, userId, productId]
                );
            } else {
                // Ajouter un nouvel item
                await dbConn.run(
                    'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
                    [userId, productId, quantity]
                );
            }

            res.status(201).json({ message: 'Produit ajouté au panier' });
        } catch (error) {
            console.error('Erreur addToCart:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    },

    // Obtenir le contenu du panier
    getCart: async (req, res) => {
        try {
            const userId = req.userData.userId;
            const dbConn = await db();

            const cartItems = await dbConn.all(`
                SELECT 
                    cart_items.id as cart_item_id,
                    cart_items.quantity,
                    products.id as product_id,
                    products.libelle,
                    products.description,
                    products.prix,
                    products.stock
                FROM cart_items
                JOIN products ON cart_items.product_id = products.id
                WHERE cart_items.user_id = ?
            `, [userId]);

            res.json(cartItems);
        } catch (error) {
            console.error('Erreur getCart:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    },

    // Mettre à jour la quantité
    updateCartItem: async (req, res) => {
        try {
            const { cartItemId } = req.params;
            const { quantity } = req.body;
            const userId = req.userData.userId;
            const dbConn = await db();

            // Vérifier si l'article existe et appartient à l'utilisateur
            const cartItem = await dbConn.get(
                'SELECT * FROM cart_items WHERE id = ? AND user_id = ?',
                [cartItemId, userId]
            );

            if (!cartItem) {
                return res.status(404).json({ message: 'Article non trouvé dans le panier' });
            }

            // Vérifier le stock
            const product = await dbConn.get(
                'SELECT stock FROM products WHERE id = ?',
                [cartItem.product_id]
            );

            if (product.stock < quantity) {
                return res.status(400).json({ message: 'Stock insuffisant' });
            }

            // Mettre à jour la quantité
            await dbConn.run(
                'UPDATE cart_items SET quantity = ? WHERE id = ?',
                [quantity, cartItemId]
            );

            res.json({ message: 'Quantité mise à jour' });
        } catch (error) {
            console.error('Erreur updateCartItem:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    },

    // Supprimer du panier
    removeFromCart: async (req, res) => {
        try {
            const { cartItemId } = req.params;
            const userId = req.userData.userId;
            const dbConn = await db();

            const result = await dbConn.run(
                'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
                [cartItemId, userId]
            );

            if (result.changes === 0) {
                return res.status(404).json({ message: 'Article non trouvé dans le panier' });
            }

            res.json({ message: 'Article retiré du panier' });
        } catch (error) {
            console.error('Erreur removeFromCart:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    },

    clearCart: async (req, res) => {
        try {
            const userId = req.userData.userId;
            const dbConn = await db();

            await dbConn.run('DELETE FROM cart_items WHERE user_id = ?', [userId]);

            res.json({ message: 'Panier vidé avec succès' });
        } catch (error) {
            console.error('Erreur clearCart:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }
};

module.exports = cartController; 