import db from '../models';
import config from '../config';
import { AuthenticationError } from '../components/errors';
import Bluebird from 'bluebird';
import jwt from 'jsonwebtoken';
import * as authConstants from './constants';

function getToken(authString, acceptedScheme) {
    if (!authString) {
        return null;
    }
    const [scheme, token] = authString.split(' ');
    if (scheme !== acceptedScheme) {
        return null;
    }
    return token;
}

function authenticateToken(req) {
    const authString = req.get('Authorization');
    const token = getToken(authString, 'Token');
    if (!token) return Bluebird.resolve(false);
    return db.APIToken.findOne({
        where: { token }
    })
    .then(apiToken => !!apiToken);
}

function authenticateModerator(req) {
    const authString = req.get('Authorization');
    const token = getToken(authString, 'Bearer');
    if (!token) return false;
    try {
        const decodedToken = jwt.verify(token, config.jwtSecret);
        req.user = decodedToken;
        return 'isAdmin' in decodedToken && !decodedToken.isAdmin;
    } catch (err) {
        return false;
    }
}

function authenticateAdministrator(req) {
    const authString = req.get('Authorization');
    const token = getToken(authString, 'Bearer');
    if (!token) return false;
    try {
        const decodedToken = jwt.verify(token, config.jwtSecret);
        req.user = decodedToken;
        return decodedToken.isAdmin === true;
    } catch (err) {
        return false;
    }
}

export function authenticate(auth, req) {
    switch (auth) {
    case authConstants.TOKEN:
        return authenticateToken(req);
    case authConstants.MODERATOR:
        return Bluebird.resolve(authenticateModerator(req));
    case authConstants.ADMINISTRATOR:
        return Bluebird.resolve(authenticateAdministrator(req));
    }
}

export function createAuthMiddleware(auth) {
    return (req, res, next) => {
        let aboveLevel = false;
        let isAuthenticated = false;
        Bluebird.each(authConstants.HIERARCHY, authInner => {
            // check if the iteration is at the correct level
            if (auth === authInner) {
                aboveLevel = true;
            }
            // skip if authenticated or we have not yet come to the correctlevel(s)
            if (isAuthenticated || !aboveLevel) {
                return;
            }
            return authenticate(authInner, req)
            .then(result => {
                isAuthenticated = result;
            });
        })
        .then(() => {
            if (isAuthenticated) {
                next();
            } else {
                next(new AuthenticationError());
            }
        })
        .catch(next);
    };
}
