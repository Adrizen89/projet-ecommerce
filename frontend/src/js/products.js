import '../css/style.css';
import { updateNavigation } from './nav';

document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    const productsContainer = document.getElementById('products-container');
    const addProductBtn = document.getElementById('add-product-btn');
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    async function loadProducts() {
        try {
            const response = await fetch('http://localhost:5001/api/products');
            const products = await response.json();
            
            if (productsContainer) {
                productsContainer.innerHTML = products.map(product => `
                    <div class="card product-card">
                        <h3>${product.libelle}</h3>
                        <p>${product.description}</p>
                        <p class="price">${product.prix} €</p>
                        <p>Stock: ${product.stock}</p>
                        <div class="product-actions">
                            ${token ? `
                                <button class="btn btn-primary" onclick="addToCart(${product.id})">
                                    Ajouter au panier
                                </button>
                                ${product.user_id == userId ? `
                                    <button class="btn" onclick="editProduct(${product.id})">
                                        Modifier
                                    </button>
                                    <button class="btn btn-danger" onclick="deleteProduct(${product.id})">
                                        Supprimer
                                    </button>
                                ` : ''}
                            ` : `
                                <a href="/login.html" class="btn">Se connecter pour acheter</a>
                            `}
                        </div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Erreur:', error);
            if (productsContainer) {
                productsContainer.innerHTML = '<p>Erreur lors du chargement des produits</p>';
            }
        }
    }

    window.addToCart = async (productId) => {
        try {
            const response = await fetch('http://localhost:5001/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId,
                    quantity: 1
                })
            });

            if (!response.ok) throw new Error('Erreur lors de l\'ajout au panier');

            alert('Produit ajouté au panier');
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'ajout au panier');
        }
    };

    window.editProduct = (productId) => {
        window.location.href = `/product-form.html?id=${productId}`;
    };

    window.deleteProduct = async (productId) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

        try {
            const response = await fetch(`http://localhost:5001/api/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Erreur lors de la suppression');

            alert('Produit supprimé avec succès');
            loadProducts();
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la suppression du produit');
        }
    };

    if (addProductBtn && token) {
        addProductBtn.style.display = 'block';
        addProductBtn.addEventListener('click', () => {
            window.location.href = '/product-form.html';
        });
    }

    loadProducts();
});

class ProductManager {
    static API_URL = 'http://localhost:5000/api';

    static async getAllProducts() {
        try {
            const response = await fetch(`${this.API_URL}/products`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la récupération des produits:', error);
            throw error;
        }
    }

    static async createProduct(formData) {
        try {
            const response = await fetch(`${this.API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
                },
                body: formData
            });
            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la création du produit:', error);
            throw error;
        }
    }

    static renderProductCard(product) {
        return `
            <div class="bg-white rounded-lg shadow-md p-4">
                <img src="${product.images[0] || '/images/placeholder.jpg'}" 
                     alt="${product.libelle}" 
                     class="w-full h-48 object-cover rounded">
                <h3 class="text-xl font-semibold mt-2">${product.libelle}</h3>
                <p class="text-gray-600">${product.description.substring(0, 100)}...</p>
                <div class="flex justify-between items-center mt-4">
                    <span class="text-lg font-bold">${product.prix}€</span>
                    <button onclick="addToCart(${product.id})" 
                            class="bg-blue-500 text-white px-4 py-2 rounded">
                        Ajouter au panier
                    </button>
                </div>
            </div>
        `;
    }
} 