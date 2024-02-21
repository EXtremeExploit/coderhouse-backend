import { Router } from 'express';

import cartsRouter from './api/carts.js';
import productsRouter from './api/products.js';

const router = Router();

router.use('/carts', cartsRouter);
router.use('/products', productsRouter);


export default router;
