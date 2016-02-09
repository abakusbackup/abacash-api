import expressJwt from 'express-jwt';
import db from '../models';
import config from '../config';
import { AuthenticationError } from '../components/errors';

export function isTokenAuthenticated(req, res, next) {
    const [scheme, token] = req.get('Authorization').split(' ');
    if (scheme !== 'Token') {
        return next(new AuthenticationError());
    }

    db.APIToken.findOne({
        where: { token }
    })
    .then(apiToken => {
        if (!apiToken) {
            return next(new AuthenticationError());
        }
        req.apiToken = apiToken;
        return next();
    })
    .catch(next);
}

export const isAuthenticated = expressJwt({ secret: config.jwtSecret });
