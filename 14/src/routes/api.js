import { Router } from 'express';

import cartsRouter from './api/carts.js';
import productsRouter from './api/products.js';
import sessionRouter from './api/session.js';
import userRouter from './api/user.js';

const router = Router();

router.use('/carts', cartsRouter);
router.use('/products', productsRouter);
router.use('/session', sessionRouter);
router.use('/users', userRouter);

export default router;
