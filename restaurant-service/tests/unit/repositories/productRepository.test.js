import { getProduct } from '@repositories/productRepository.js';

describe('productRepository', () => {
  it('deve retornar produto de exemplo', () => {
    expect(getProduct()).toEqual({ id: 1, name: 'Produto Exemplo' });
  });
});
