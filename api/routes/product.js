import { Router } from 'express';
import ProductController from '../controllers/ProductController';

const router = Router();

router.get('/:page/:limit', ProductController.getAll);
router.get('/:sku', ProductController.getBySku);

export default router;