import express from 'express';
import * as controller from '../controllers/system.controller';
import { isAuthenticated } from '../auth/middleware';

const router = express.Router();

router.get('/', controller.list);
router.post('/', isAuthenticated, controller.create);
router.get('/:id', controller.retrieve);
router.put('/:id', isAuthenticated, controller.update);

export default router;
