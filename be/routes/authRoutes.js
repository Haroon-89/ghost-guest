import { Router } from 'express';
import { register, login, verifyAlive } from '../controllers/authController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-alive/:token', verifyAlive);

export default router;
