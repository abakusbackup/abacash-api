import express from 'express';
import * as controller from '../controllers/product.controller';
import { isTokenAuthenticated, isAuthenticated } from '../auth/middleware';

const router = express.Router();

router.get('/', controller.list);
router.post('/', isAuthenticated, controller.create);
router.get('/:id', isTokenAuthenticated, controller.retrieve);
router.delete('/:id', isAuthenticated, controller.destroy);

export default router;
