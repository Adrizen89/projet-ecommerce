const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

async function initializeDatabase() {
    const dbPath = path.resolve(__dirname, 'ecommerce.db');
    const sqlPath = path.resolve(__dirname, 'init.sql');

    // Créer le répertoire database s'il n'existe pas
    if (!fs.existsSync(path.dirname(dbPath))) {
        fs.mkdirSync(path.dirname(dbPath));
    }

    try {
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        const initSQL = fs.readFileSync(sqlPath, 'utf-8');
        await db.exec(initSQL);
        
        console.log('Base de données initialisée avec succès !');
        await db.close();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
        process.exit(1);
    }
}

initializeDatabase(); 