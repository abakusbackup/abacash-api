import express from 'express';
import * as controller from '../controllers/transaction.controller';
import { isTokenAuthenticated } from '../auth/middleware';

const router = express.Router();

router.use(isTokenAuthenticated);
router.get('/', controller.list);
router.get('/:transactionId', controller.retrieve);
router.post('/', controller.add);

export default router;
