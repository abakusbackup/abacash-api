import express from 'express';
import * as controller from '../controllers/product.controller';
import { requires } from '../auth';
import { TOKEN, MODERATOR } from '../auth/constants';

const router = express.Router();

router.get('/', requires(TOKEN), controller.list);
router.post('/', requires(MODERATOR), controller.create);
router.get('/:id', requires(TOKEN), controller.retrieve);
router.put('/:id', requires(TOKEN), controller.update);
router.delete('/:id', requires(MODERATOR), controller.destroy);

export default router;
