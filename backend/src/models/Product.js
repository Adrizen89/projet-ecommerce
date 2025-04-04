class Product {
    constructor() {
        this.id = null;
        this.libelle = '';
        this.description = '';
        this.images = [];
        this.prix = 0;
        this.categorie = '';
    }

    static validateProduct(product) {
        const requiredFields = ['libelle', 'description', 'prix', 'categorie'];
        return requiredFields.every(field => product[field] !== undefined && product[field] !== '');
    }
}

module.exports = Product; 