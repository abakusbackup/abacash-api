import express from 'express';
import db from '../models';
import auth from './auth.routes';
import customer from './customer.routes';
import system from './system.routes';
import user from './user.routes';
import product from './product.routes';
import nerd from './nerd.routes';
import customerRole from './customer-role.routes';
import transaction from './transaction.routes';
import apiToken from './api-token.routes';
import systemRole from './system-role.routes';
import * as errors from '../components/errors';

const router = express.Router();
const apiRouter = express.Router();

router.use(apiRouter);

apiRouter.param('system', (req, res, next, id) => {
    db.System.findOne({
        where: { id }
    })
    .then(systemInstance => {
        if (!systemInstance) throw new errors.NotFoundError();
        req.system = systemInstance;
        next();
    })
    .catch(next);
});

apiRouter.use('/authenticate', auth);
apiRouter.use('/api-tokens', apiToken);
apiRouter.use('/users', user);
apiRouter.use('/systems', system);
apiRouter.use('/nerd', nerd);
apiRouter.use('/:system/customers', customer);
apiRouter.use('/:system/roles', customerRole);
apiRouter.use('/:system/users', systemRole);
apiRouter.use('/:system/products', product);
apiRouter.use('/:system/transactions', transaction);

router.use(errors.pageNotFoundMiddleware);
router.use(errors.errorMiddleware);

export default router;
