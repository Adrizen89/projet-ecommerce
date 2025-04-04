import '../css/style.css';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Les mots de passe ne correspondent pas');
                return;
            }

            try {
                console.log('Tentative d\'inscription...'); // Debug
                const response = await fetch('http://localhost:5001/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                console.log('Réponse reçue:', response.status); // Debug

                const data = await response.json();
                console.log('Données reçues:', data); // Debug

                if (response.ok) {
                    alert('Inscription réussie ! Vous allez être redirigé vers la page de connexion.');
                    window.location.href = '/login.html';
                } else {
                    throw new Error(data.message || 'Erreur lors de l\'inscription');
                }
            } catch (error) {
                console.error('Erreur détaillée:', error);
                alert(`Erreur lors de l'inscription: ${error.message}`);
            }
        });
    }
}); 