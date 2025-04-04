const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function getDbConnection() {
    try {
        const db = await open({
            filename: path.join(__dirname, '../../database.sqlite'),
            driver: sqlite3.Database
        });

        // Créer la table users
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Créer la table products avec référence à l'utilisateur
        await db.exec(`
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                libelle TEXT NOT NULL,
                description TEXT,
                prix DECIMAL(10,2) NOT NULL,
                categorie TEXT,
                image_url TEXT,
                stock INTEGER DEFAULT 0,
                user_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        // Créer la table panier
        await db.exec(`
            CREATE TABLE IF NOT EXISTS cart_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                quantity INTEGER DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (product_id) REFERENCES products(id)
            )
        `);

        // Créer la table des commandes
        await db.exec(`
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                total_amount DECIMAL(10,2) NOT NULL,
                status TEXT DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        // Créer la table des détails de commande
        await db.exec(`
            CREATE TABLE IF NOT EXISTS order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL,
                price_at_time DECIMAL(10,2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id),
                FOREIGN KEY (product_id) REFERENCES products(id)
            )
        `);

        // Insérer quelques produits de test si la table est vide
        const productsCount = await db.get('SELECT COUNT(*) as count FROM products');
        if (productsCount.count === 0) {
            await db.exec(`
                INSERT INTO products (libelle, description, prix, categorie, stock) VALUES
                ('iPhone 14', 'Dernier modèle iPhone avec des fonctionnalités avancées', 999.99, 'Smartphones', 50),
                ('Samsung Galaxy S23', 'Smartphone Android haut de gamme', 899.99, 'Smartphones', 45),
                ('MacBook Pro', 'Ordinateur portable pour les professionnels', 1499.99, 'Ordinateurs', 30),
                ('iPad Air', 'Tablette polyvalente et performante', 599.99, 'Tablettes', 60),
                ('AirPods Pro', 'Écouteurs sans fil avec réduction de bruit', 249.99, 'Accessoires', 100)
            `);
        }

        return db;
    } catch (error) {
        console.error('Erreur de connexion à la base de données:', error);
        throw error;
    }
}

module.exports = getDbConnection; 