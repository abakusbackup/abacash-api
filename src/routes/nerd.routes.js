import express from 'express';
import * as controller from '../controllers/nerd.controller';
import { createAuthMiddleware } from '../auth';
import { TOKEN } from '../auth/constants';


const router = express.Router();

router.use(createAuthMiddleware(TOKEN));
router.get('/', controller.list);
router.get('/:username', controller.retrieve);

export default router;
