import express from 'express';
import * as controller from '../controllers/system.controller';
import { isAuthenticated, isTokenAuthenticated } from '../auth/middleware';

const router = express.Router();

router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:id', controller.retrieve);
router.get('/:id/users', controller.users);
router.put('/:id', controller.update);

export default router;
