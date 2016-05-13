import express from 'express';
import * as controller from '../controllers/account.controller';
import { requires } from '../auth';
import { MODERATOR } from '../auth/constants';

const router = express.Router();

router.use(requires(MODERATOR));
router.get('/', controller.retrieve);
router.put('/', controller.update);
router.put('/password', controller.password);

export default router;
