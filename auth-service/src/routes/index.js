import express from 'express';


import defaultRoutes from './defaultRoutes.js';
import authRoutes from './authRoutes.js';


const router = express.Router();

router.use('/', defaultRoutes);
router.use('/auth', authRoutes);

export default router;
