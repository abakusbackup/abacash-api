import express from 'express';
import * as controller from '../controllers/user.controller';
import * as account from '../controllers/account.controller';
import { isAuthenticated } from '../auth/middleware';

const router = express.Router();

router.use(isAuthenticated);

router.get('/me', account.retrieve);
router.put('/me', account.update);
router.delete('/me', account.destroy);

router.get('/', controller.list);
router.get('/:id', controller.retrieve);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

export default router;
