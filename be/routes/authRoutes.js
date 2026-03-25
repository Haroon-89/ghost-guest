import { Router } from 'express';
import { register, login, verifyAlive, getMe } from '../controllers/authController.js';
import auth from '../middlewares/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-alive/:token', verifyAlive);
router.get('/me', auth, getMe);

export default router;
