import express from 'express';
import * as controller from '../controllers/product.controller';
import { createAuthMiddleware } from '../auth';
import { TOKEN, MODERATOR } from '../auth/constants';

const router = express.Router();

router.get('/', createAuthMiddleware(TOKEN), controller.list);
router.post('/', createAuthMiddleware(MODERATOR), controller.create);
router.put('/:id', createAuthMiddleware(TOKEN), controller.update);
router.get('/:id', createAuthMiddleware(TOKEN), controller.retrieve);
router.delete('/:id', createAuthMiddleware(MODERATOR), controller.destroy);

export default router;
