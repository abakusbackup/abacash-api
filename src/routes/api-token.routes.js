import express from 'express';
import * as controller from '../controllers/api-token.controller';
import { createAuthMiddleware } from '../auth';
import { MODERATOR } from '../auth/constants';

const router = express.Router();

router.use(createAuthMiddleware(MODERATOR));
router.get('/', controller.list);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

export default router;
