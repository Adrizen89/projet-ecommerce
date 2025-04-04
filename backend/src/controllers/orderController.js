const db = require('../config/database');

const orderController = {
    createOrder: async (req, res) => {
        try {
            const userId = req.userData.userId;
            const dbConn = await db();

            // Récupérer les articles du panier
            const cartItems = await dbConn.all(`
                SELECT 
                    cart_items.quantity,
                    products.id as product_id,
                    products.prix,
                    products.stock
                FROM cart_items
                JOIN products ON cart_items.product_id = products.id
                WHERE cart_items.user_id = ?
            `, [userId]);

            if (cartItems.length === 0) {
                return res.status(400).json({ message: 'Panier vide' });
            }

            // Calculer le montant total
            const totalAmount = cartItems.reduce((total, item) => {
                return total + (item.prix * item.quantity);
            }, 0);

            // Créer la commande
            const orderResult = await dbConn.run(
                'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
                [userId, totalAmount]
            );

            const orderId = orderResult.lastID;

            // Ajouter les articles de la commande
            for (const item of cartItems) {
                // Vérifier le stock
                if (item.stock < item.quantity) {
                    return res.status(400).json({ 
                        message: 'Stock insuffisant pour certains produits' 
                    });
                }

                // Ajouter l'article à la commande
                await dbConn.run(
                    'INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES (?, ?, ?, ?)',
                    [orderId, item.product_id, item.quantity, item.prix]
                );

                // Mettre à jour le stock
                await dbConn.run(
                    'UPDATE products SET stock = stock - ? WHERE id = ?',
                    [item.quantity, item.product_id]
                );
            }

            // Vider le panier
            await dbConn.run('DELETE FROM cart_items WHERE user_id = ?', [userId]);

            res.status(201).json({
                message: 'Commande créée avec succès',
                orderId: orderId
            });
        } catch (error) {
            console.error('Erreur createOrder:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    },

    getUserOrders: async (req, res) => {
        try {
            const userId = req.userData.userId;
            const dbConn = await db();

            const orders = await dbConn.all(`
                SELECT 
                    orders.*,
                    GROUP_CONCAT(
                        json_object(
                            'product_id', order_items.product_id,
                            'quantity', order_items.quantity,
                            'price', order_items.price_at_time
                        )
                    ) as items
                FROM orders
                LEFT JOIN order_items ON orders.id = order_items.order_id
                WHERE orders.user_id = ?
                GROUP BY orders.id
                ORDER BY orders.created_at DESC
            `, [userId]);

            res.json(orders);
        } catch (error) {
            console.error('Erreur getUserOrders:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }
};

module.exports = orderController; 