export function updateNavigation() {
    const token = localStorage.getItem('token');
    
    // Récupérer les éléments avec une vérification de null
    const cartBadge = document.getElementById('cart-badge');
    const profileLink = document.getElementById('profileLink');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const dashboardLink = document.getElementById('dashboardLink');
    const logoutBtn = document.getElementById('logoutBtn');

    if (token) {
        // Utilisateur connecté
        if (profileLink) profileLink.style.display = 'block';
        if (logoutBtn) {
            logoutBtn.style.display = 'block';
            // Gérer la déconnexion
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                window.location.href = '/';
            });
        }
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';

        // Mettre à jour le nombre d'articles dans le panier
        if (cartBadge) {
            fetch('http://localhost:5001/api/cart', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(cartItems => {
                const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
                cartBadge.textContent = itemCount;
                cartBadge.style.display = itemCount > 0 ? 'block' : 'none';
            })
            .catch(error => console.error('Erreur lors du chargement du panier:', error));
        }
    } else {
        // Utilisateur non connecté
        if (profileLink) profileLink.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (loginLink) loginLink.style.display = 'block';
        if (registerLink) registerLink.style.display = 'block';
        if (dashboardLink) dashboardLink.style.display = 'block';
        if (cartBadge) cartBadge.style.display = 'none';
    }
} 