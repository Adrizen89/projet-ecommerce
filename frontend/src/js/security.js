class SecurityManager {
    static setupCSP() {
        // Configuration des rapports CSP
        document.addEventListener('securitypolicyviolation', (e) => {
            const violation = {
                'blocked-uri': e.blockedURI,
                'directive': e.violatedDirective,
                'document-uri': e.documentURI,
                'timestamp': new Date().toISOString()
            };

            fetch('/api/csp-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(violation)
            });
        });
    }

    static sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    static validatePassword(password) {
        // Selon les recommandations NIST
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*]/.test(password);

        return password.length >= minLength &&
               hasUpperCase &&
               hasLowerCase &&
               hasNumbers &&
               hasSpecialChar;
    }
} 