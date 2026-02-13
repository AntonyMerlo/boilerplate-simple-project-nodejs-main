import request from 'supertest';
import express from 'express';
import routes from '@routes/index.js';

const app = express();
app.use(express.json());
app.use(routes);

describe('Product Routes', () => {
  it('GET /product deve retornar produto de exemplo', async () => {
    const res = await request(app).get('/product');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ id: 1, name: 'Produto Exemplo' });
  });
});
