import express from 'express';
import * as controller from '../controllers/customer-role.controller';
import { isAuthenticated } from '../auth/middleware';

const router = express.Router();

router.use(isAuthenticated);
router.get('/', controller.list);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

export default router;
