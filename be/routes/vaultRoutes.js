import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { addItem, getItems, updateItem, deleteItem } from '../controllers/vaultController.js';

const router = Router();

router.use(auth);
router.post('/', addItem);
router.get('/', getItems);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

export default router;
