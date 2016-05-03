import express from 'express';
import * as controller from '../controllers/account.controller';
import { isAuthenticated } from '../auth/middleware';

const router = express.Router();

router.use(isAuthenticated);
router.get('/', controller.retrieve);

export default router;
