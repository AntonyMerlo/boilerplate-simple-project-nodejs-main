import request from 'supertest';
import express from 'express';
import routes from '@routes/index.js';

const app = express();
app.use(express.json());
app.use(routes);

describe('User Routes', () => {
  it('GET /user deve retornar usuário de exemplo', async () => {
    const res = await request(app).get('/user');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ id: 1, name: 'Usuário Exemplo' });
  });
});
