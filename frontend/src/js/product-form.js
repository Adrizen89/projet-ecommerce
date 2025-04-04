import '../css/style.css';

document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const formTitle = document.getElementById('form-title');
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Récupérer l'ID du produit depuis l'URL si on est en mode édition
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Si on a un ID, on charge les données du produit
    if (productId) {
        formTitle.textContent = 'Modifier le Produit';
        loadProduct(productId);
    }

    async function loadProduct(id) {
        try {
            const response = await fetch(`http://localhost:5001/api/products/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Produit non trouvé');

            const product = await response.json();
            
            // Remplir le formulaire avec les données du produit
            document.getElementById('libelle').value = product.libelle;
            document.getElementById('description').value = product.description;
            document.getElementById('prix').value = product.prix;
            document.getElementById('categorie').value = product.categorie;
            document.getElementById('stock').value = product.stock;
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors du chargement du produit');
            window.location.href = '/products.html';
        }
    }

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const productData = {
            libelle: document.getElementById('libelle').value,
            description: document.getElementById('description').value,
            prix: parseFloat(document.getElementById('prix').value),
            categorie: document.getElementById('categorie').value,
            stock: parseInt(document.getElementById('stock').value)
        };

        try {
            const url = productId 
                ? `http://localhost:5001/api/products/${productId}`
                : 'http://localhost:5001/api/products';
            
            const method = productId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) throw new Error('Erreur lors de la sauvegarde');

            alert(productId ? 'Produit modifié avec succès' : 'Produit ajouté avec succès');
            window.location.href = '/products.html';
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la sauvegarde du produit');
        }
    });
}); 