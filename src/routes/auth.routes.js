import express from 'express';
import * as controller from '../controllers/customer.controller';

const router = express.Router();

router.post('/', controller.authenticate);

export default router;
