import chai from 'chai';
import jwt from 'jsonwebtoken';
import { authenticate } from '../../src/auth';
import { TOKEN, MODERATOR, ADMINISTRATOR } from '../../src/auth/constants';
import { loadFixtures, mockRequest } from '../helpers';
import config from '../../src/config';

chai.should();

describe('Auth', () => {
    describe('Token', () => {
        const fixtures = [
            'systems.json',
            'api-tokens.json'
        ];

        beforeEach(() => loadFixtures(fixtures));
        it('should accept valid token', () =>
            authenticate(TOKEN, mockRequest('Token d54f9200b680ff11eb1ffcb01a99bde2'))
            .then(res => {
                res.should.equal(true);
            })
        );

        it('should reject invalid bearer', () =>
            authenticate(TOKEN, mockRequest('Invalid d54f9200b680ff11eb1ffcb01a99bde2'))
            .then(res => {
                res.should.equal(false);
            })
        );

        it('should reject invalid token', () =>
            authenticate(TOKEN, mockRequest('Token 133123123'))
            .then(res => {
                res.should.equal(false);
            })
        );
    });
    describe('Moderator', () => {
        it('should accept valid moderator token', () => {
            const token = jwt.sign({
                isAdmin: false
            }, config.jwtSecret, {
                expiresIn: config.jwtExpiresIn
            });
            return authenticate(MODERATOR, mockRequest(`Bearer ${token}`))
            .then(res => {
                res.should.equal(true);
            });
        });

        it('should reject administrator token', () => {
            const token = jwt.sign({
                isAdmin: true
            }, config.jwtSecret, {
                expiresIn: config.jwtExpiresIn
            });
            return authenticate(MODERATOR, mockRequest(`Bearer ${token}`))
            .then(res => {
                res.should.equal(false);
            });
        });

        it('should reject empty token', () => {
            const token = jwt.sign({}, config.jwtSecret, {
                expiresIn: config.jwtExpiresIn
            });
            return authenticate(MODERATOR, mockRequest(`Bearer ${token}`))
            .then(res => {
                res.should.equal(false);
            });
        });

        it('should reject invalid bearer', () => {
            const token = jwt.sign({
                isAdmin: false
            }, config.jwtSecret, {
                expiresIn: config.jwtExpiresIn
            });
            return authenticate(MODERATOR, mockRequest(`NotBearer ${token}`))
            .then(res => {
                res.should.equal(false);
            });
        });
    });

    describe('Administrator', () => {
        it('should accept valid administrator token', () => {
            const token = jwt.sign({
                isAdmin: true
            }, config.jwtSecret, {
                expiresIn: config.jwtExpiresIn
            });
            return authenticate(ADMINISTRATOR, mockRequest(`Bearer ${token}`))
            .then(res => {
                res.should.equal(true);
            });
        });

        it('should reject moderator token', () => {
            const token = jwt.sign({
                isAdmin: false
            }, config.jwtSecret, {
                expiresIn: config.jwtExpiresIn
            });
            return authenticate(ADMINISTRATOR, mockRequest(`Bearer ${token}`))
            .then(res => {
                res.should.equal(false);
            });
        });

        it('should reject empty token', () => {
            const token = jwt.sign({}, config.jwtSecret, {
                expiresIn: config.jwtExpiresIn
            });
            return authenticate(ADMINISTRATOR, mockRequest(`Bearer ${token}`))
            .then(res => {
                res.should.equal(false);
            });
        });

        it('should reject invalid bearer', () => {
            const token = jwt.sign({
                isAdmin: true
            }, config.jwtSecret, {
                expiresIn: config.jwtExpiresIn
            });
            return authenticate(ADMINISTRATOR, mockRequest(`NotBearer ${token}`))
            .then(res => {
                res.should.equal(false);
            });
        });
    });
});
