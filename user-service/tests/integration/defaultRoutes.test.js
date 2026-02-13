import request from 'supertest';
import express from 'express';
import routes from '@routes/index.js';

const app = express();
app.use(express.json());
app.use(routes);

describe('Default/Health Routes', () => {
  it('GET / deve retornar mensagem padrão', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('GET /health deve retornar status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
