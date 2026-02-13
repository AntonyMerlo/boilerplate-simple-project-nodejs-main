import express from 'express';
import {
  create,
  list,
  getById,
  update,
  remove
} from '../controllers/orderController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);
router.get('/', list);
router.post('/', create);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
