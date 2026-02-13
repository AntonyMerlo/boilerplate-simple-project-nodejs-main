import { getProduct } from '@services/productService.js';

describe('productService', () => {
  it('deve retornar produto de exemplo via service', () => {
    expect(getProduct()).toEqual({ id: 1, name: 'Produto Exemplo' });
  });
});
