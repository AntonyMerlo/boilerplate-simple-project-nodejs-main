import express from 'express';
import {
	list,
	getById,
	update,
	remove
} from '../controllers/userController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);
router.get('/', list);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
