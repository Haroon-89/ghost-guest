import { Router } from 'express';
import auth from '../middlewares/auth.js';
import isAdmin from '../middlewares/isAdmin.js';
import { getAllUsers, getUserDetails, releaseVault, getAllNotifications } from '../controllers/adminController.js';

const router = Router();

router.use(auth, isAdmin);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.put('/users/:id/release', releaseVault);
router.get('/notifications', getAllNotifications);

export default router;
