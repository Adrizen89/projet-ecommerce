import '../css/style.css';
import { updateNavigation } from './nav';

document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:5001/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Stockage du token
                    localStorage.setItem('token', data.token);
                    alert('Connexion réussie !');
                    window.location.href = '/products.html';
                } else {
                    alert(data.message || 'Erreur lors de la connexion');
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors de la connexion');
            }
        });
    }
});

const API_URL = 'http://localhost:5000/api';

class Auth {
    static async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Échec de la connexion');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            return data;
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            throw error;
        }
    }

    static isAuthenticated() {
        return localStorage.getItem('token') !== null;
    }

    static logout() {
        localStorage.removeItem('token');
        window.location.href = '/login.html';
    }
} 