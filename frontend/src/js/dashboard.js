class Dashboard {
    static async loadStats() {
        try {
            const token = localStorage.getItem('token');
            console.log("Token:", token);
            const response = await fetch('http://localhost:5001/api/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                console.error('La réponse n\'est pas OK. Code:', response.status);
                return;
            }
            const stats = await response.json();
            console.log("Données reçues pour les stats:", stats);
            this.displayStats(stats);
        } catch (error) {
            console.error('Erreur lors du chargement des statistiques:', error);
        }
    }

    static displayStats(stats) {
        const container = document.getElementById('stats-container');
        if (!container) {
            console.error('Element stats-container introuvable dans le HTML');
            return;
        }
        // Affichage en forme brute (JSON indenté)
        container.innerHTML = `<pre>${JSON.stringify(stats, null, 2)}</pre>`;
    }

    static async init() {
        // Gestion du formulaire d'ajout de produit
        const form = document.getElementById('add-product-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(form);
                try {
                    const response = await fetch('http://localhost:5001/api/products', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: formData
                    });
                    if (response.ok) {
                        alert('Produit ajouté avec succès');
                        form.reset();
                    } else {
                        throw new Error('Erreur lors de l\'ajout du produit');
                    }
                } catch (error) {
                    console.error('Erreur:', error);
                    alert('Erreur lors de l\'ajout du produit');
                }
            });
        }

        // Charger les statistiques
        await this.loadStats();
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    Dashboard.init();
});

export default Dashboard;
