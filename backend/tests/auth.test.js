const request = require('supertest');
const app = require('../server');
const db = require('../src/config/database');

describe('Tests d\'authentification', () => {


    test('Inscription réussie', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@test.com',
                password: 'TestPassword123!'
            });
        expect(response.statusCode).toBe(201);
    });

    test('Connexion réussie', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@test.com',
                password: 'TestPassword123!'
            });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
}); 