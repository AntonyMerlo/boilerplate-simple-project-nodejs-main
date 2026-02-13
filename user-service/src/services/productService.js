import { getProduct as getProductRepository } from '../repositories/productRepository.js';

export const getProduct = () => {
  return getProductRepository();
};
