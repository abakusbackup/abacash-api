import express from 'express';
import * as controller from '../controllers/customer.controller';
import { isTokenAuthenticated } from '../auth/middleware';

const router = express.Router();

router.use(isTokenAuthenticated);
router.get('/', controller.list);
router.get('/:lookup', controller.retrieve);
router.post('/', controller.create);
router.put('/:customerId', controller.update);
router.delete('/:customerId', controller.destroy);

export default router;
