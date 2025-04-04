const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// Routes d'authentification
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);

// Routes des produits
router.get('/products', productController.getAllProducts);
router.get('/products/user', authMiddleware, productController.getUserProducts);
router.post('/products', authMiddleware, productController.createProduct);
router.get('/products/:id', productController.getProductById);
router.put('/products/:id', authMiddleware, productController.updateProduct);
router.delete('/products/:id', authMiddleware, productController.deleteProduct);

// Routes du panier
router.get('/cart', authMiddleware, cartController.getCart);
router.post('/cart', authMiddleware, cartController.addToCart);
router.put('/cart/:cartItemId', authMiddleware, cartController.updateCartItem);
router.delete('/cart/:cartItemId', authMiddleware, cartController.removeFromCart);
router.delete('/cart/clear', authMiddleware, cartController.clearCart);

// Routes des commandes
router.get('/orders', authMiddleware, orderController.getUserOrders);
router.post('/orders', authMiddleware, orderController.createOrder);

// Routes du profil utilisateur
router.get('/users/profile', authMiddleware, userController.getProfile);

// Route des statistiques
router.get('/stats', authMiddleware, productController.getStats);

module.exports = router; 