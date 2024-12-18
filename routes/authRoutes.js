import { Router } from 'express';
import authController from '../controllers/authController.js'; // Ensure correct path and .js extension

const router = Router();
console.log('Registering /register route...');

router.post('/login', authController.login);
router.post('/register', authController.register);

export default router;
