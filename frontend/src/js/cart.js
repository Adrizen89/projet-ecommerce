import '../css/style.css';
import { updateNavigation } from './nav';

document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    
    const cartContainer = document.getElementById('cart-container');
    const cartSummary = document.getElementById('cart-summary');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-badge');
    const clearCartBtn = document.getElementById('clear-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    async function loadCart() {
        try {
            const response = await fetch('http://localhost:5001/api/cart', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Erreur lors du chargement du panier');

            const cartItems = await response.json();
            
            if (cartItems.length === 0) {
                if (cartContainer) cartContainer.innerHTML = '';
                if (cartSummary) cartSummary.style.display = 'none';
                if (emptyCartMessage) emptyCartMessage.style.display = 'block';
                if (cartCount) cartCount.textContent = '0';
                return;
            }

            let total = 0;
            if (cartContainer) {
                cartContainer.innerHTML = cartItems.map(item => {
                    total += item.prix * item.quantity;
                    return `
                        <div class="cart-item card mb-3" data-id="${item.cart_item_id}">
                            <div class="cart-item-content">
                                <div class="cart-item-info">
                                    <h3>${item.libelle}</h3>
                                    <p>${item.description}</p>
                                    <p class="price">${item.prix} € / unité</p>
                                </div>
                                <div class="cart-item-actions">
                                    <div class="quantity-controls">
                                        <button class="btn" onclick="updateQuantity(${item.cart_item_id}, ${item.quantity - 1})">-</button>
                                        <span class="quantity">${item.quantity}</span>
                                        <button class="btn" onclick="updateQuantity(${item.cart_item_id}, ${item.quantity + 1})">+</button>
                                    </div>
                                    <p class="subtotal">Sous-total: ${(item.prix * item.quantity).toFixed(2)} €</p>
                                    <button class="btn btn-danger" onclick="removeFromCart(${item.cart_item_id})">
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }

            if (cartTotal) cartTotal.textContent = total.toFixed(2);
            if (cartCount) cartCount.textContent = cartItems.length.toString();
            if (cartSummary) cartSummary.style.display = 'block';
            if (emptyCartMessage) emptyCartMessage.style.display = 'none';
        } catch (error) {
            console.error('Erreur:', error);
            if (cartContainer) {
                cartContainer.innerHTML = '<p class="error">Erreur lors du chargement du panier</p>';
            }
        }
    }

    window.updateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            const response = await fetch(`http://localhost:5001/api/cart/${cartItemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quantity: newQuantity })
            });

            if (!response.ok) throw new Error('Erreur lors de la mise à jour');

            loadCart();
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la mise à jour de la quantité');
        }
    };

    window.removeFromCart = async (cartItemId) => {
        if (!confirm('Voulez-vous vraiment retirer cet article du panier ?')) return;

        try {
            const response = await fetch(`http://localhost:5001/api/cart/${cartItemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Erreur lors de la suppression');

            loadCart();
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la suppression de l\'article');
        }
    };

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', async () => {
            if (!confirm('Voulez-vous vraiment vider votre panier ?')) return;

            try {
                const response = await fetch('http://localhost:5001/api/cart/clear', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) throw new Error('Erreur lors du vidage du panier');

                loadCart();
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors du vidage du panier');
            }
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('http://localhost:5001/api/orders', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) throw new Error('Erreur lors de la commande');

                const data = await response.json();
                alert('Commande créée avec succès !');
                window.location.href = `/profile.html`;
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors de la création de la commande');
            }
        });
    }

    // Charger le panier au chargement de la page
    loadCart();
}); 