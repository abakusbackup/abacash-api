import raven from 'raven';
import config from '../config';
import logger from 'winston';

export const sentryClient = new raven.Client(config.sentryDsn);
sentryClient.on('error', sentryError => {
    logger.error('Failed to report to Sentry', sentryError);
});

export function handleError(error) {
    sentryClient.captureError(error);
}

export class ModelValidationError extends Error {
    name = 'ModelValidationError';
    status = 400;

    constructor(error) {
        super(error.message);
        this.payload = {
            ...error,
            name: this.name
        };
    }
}

export class ValidationError extends Error {
    name = 'ValidationError';
    status = 400;

    constructor(errorMessage) {
        super(errorMessage);
        this.message = errorMessage;
    }
}


export class RequestError extends Error {
    name = 'RequestError';
    status = 400;
}

export class AuthenticationError extends Error {
    name = 'AuthenticationError';
    status = 401;

    constructor(message = 'You need to authenticate to access this resource') {
        super(message);
        this.message = message;
    }
}

export class NotFoundError extends Error {
    name = 'NotFoundError';
    message = 'Could not find the entity';
    status = 404;
}

export function errorMiddleware(err, req, res, next) {
    if (process.env.NODE_ENV === 'development') {
        console.log(err.stack);
    }

    const status = err.status || 500;
    return res
        .status(status)
        .json(err.payload || {
            name: err.name,
            message: err.message
        });
}

export function pageNotFoundMiddleware(req, res) {
    res
        .status(404)
        .json({
            message: 'Page Not Found'
        });
}
