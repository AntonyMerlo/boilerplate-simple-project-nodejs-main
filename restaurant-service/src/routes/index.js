import express from 'express';


import defaultRoutes from './defaultRoutes.js';
import orderRoutes from './orderRoutes.js';


const router = express.Router();

router.use('/', defaultRoutes);
router.use('/orders', orderRoutes);

export default router;
