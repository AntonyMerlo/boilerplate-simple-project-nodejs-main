import express from 'express';


import defaultRoutes from './defaultRoutes.js';
import userRoutes from './userRoutes.js';


const router = express.Router();

router.use('/', defaultRoutes);
router.use('/user', userRoutes);

export default router;
