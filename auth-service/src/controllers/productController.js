import { getProduct as getProductService } from '../services/productService.js';

export const getProduct = (req, res) => {
  const product = getProductService();
  res.json(product);
};
