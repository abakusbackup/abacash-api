import express from 'express';
import * as controller from '../controllers/transaction.controller';
import { createAuthMiddleware } from '../auth';
import { TOKEN, MODERATOR } from '../auth/constants';

const router = express.Router();

router.get('/', createAuthMiddleware(MODERATOR), controller.list);
router.get('/:transactionId', createAuthMiddleware(MODERATOR), controller.retrieve);
router.post('/', createAuthMiddleware(TOKEN), controller.add);

export default router;
