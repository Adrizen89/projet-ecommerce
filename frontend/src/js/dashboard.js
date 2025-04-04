class Dashboard {
    static async loadStats() {
        try {
            const response = await fetch('http://localhost:5000/api/stats', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const stats = await response.json();
            this.displayStats(stats);
        } catch (error) {
            console.error('Erreur lors du chargement des statistiques:', error);
        }
    }

    static displayStats(stats) {
        const container = document.getElementById('stats-container');
        if (!container) return;

        const html = stats.map(stat => `
            <div class="stat-item p-4 bg-gray-50 rounded-lg">
                <h3 class="font-bold">${stat.nom}</h3>
                <p class="text-2xl">${stat.compte} produits</p>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    static async init() {
        // Gestion du formulaire d'ajout de produit
        const form = document.getElementById('add-product-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(form);
                try {
                    const response = await fetch('http://localhost:5000/api/products', {
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