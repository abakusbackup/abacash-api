import express from 'express';
import * as controller from '../controllers/nerd.controller';
import { isTokenAuthenticated } from '../auth/middleware';


const router = express.Router();

router.use(isTokenAuthenticated);
router.get('/', controller.list);
router.get('/:username', controller.retrieve);

export default router;
