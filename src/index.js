import app from './app';
import config from './config';
import { syncDB } from './model-helpers';
import logger from 'winston';

if (process.env.NODE_ENV === 'development') {
    logger.level = 'debug';
}

function listen() {
    app.listen(config.port, () => {
        logger.info('Express server listening on %d, in %s mode',
            config.port, app.get('env'));
    });
}

syncDB()
    .then(() => listen());
