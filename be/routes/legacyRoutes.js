import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { setLegacyContact } from '../controllers/legacyController.js';

const router = Router();

router.use(auth);
router.post('/', setLegacyContact);

export default router;
