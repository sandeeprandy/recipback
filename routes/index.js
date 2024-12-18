import express from 'express';
import authRoutes from './authRoutes.js';

const router = express.Router();

console.log('Adding /auth routes...');
router.use('/auth', authRoutes); // Prefix: /auth

export default router;
