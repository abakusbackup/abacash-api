import express from 'express';
import * as controller from '../controllers/system.controller';
import { createAuthMiddleware } from '../auth';
import { TOKEN, ADMINISTRATOR } from '../auth/constants';

const router = express.Router();

router.get('/', createAuthMiddleware(TOKEN), controller.list);
router.post('/', createAuthMiddleware(ADMINISTRATOR), controller.create);
router.get('/:id', createAuthMiddleware(TOKEN), controller.retrieve);
router.put('/:id', createAuthMiddleware(ADMINISTRATOR), controller.update);

export default router;
