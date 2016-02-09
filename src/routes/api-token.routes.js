import express from 'express';
import * as controller from '../controllers/api-token.controller';
import { isAuthenticated } from '../auth/middleware';

const router = express.Router();

router.use(isAuthenticated);
router.get('/', controller.list);
router.post('/', controller.create);
router.delete('/:id', controller.destroy);

export default router;
