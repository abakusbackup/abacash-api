import app from '../../src/app';
import chai from 'chai';
import request from 'supertest';
import Bluebird from 'bluebird';
import { loadFixtures, createAuthorization } from '../helpers';
import { TOKEN, MODERATOR, ADMINISTRATOR, HIERARCHY, AUTH_NAMES } from '../../src/auth/constants';

chai.should();

function checkAuthorization(auth, httpVerb, controller, shouldBeAuthenticatedForLevel) {
    return new Bluebird(resolve => {
        request(app)[httpVerb.toLowerCase()](controller)
        .set('Authorization', createAuthorization(auth))
        .end((err, res) => {
            if (shouldBeAuthenticatedForLevel) {
                chai.assert.notEqual(
                    res.status,
                    401,
                    `${httpVerb} ${controller} should be allowed with ${AUTH_NAMES[auth]}`
                );
            } else {
                chai.assert.equal(
                    res.status,
                    401,
                    `${httpVerb} ${controller} should not be allowed with ${AUTH_NAMES[auth]}`
                );
            }
            resolve();
        });
    });
}
function testSecurity(controller, httpVerb, authId) {
    it(`${controller} should be ${authId}  authenticated for ${httpVerb}`, done => {
        let shouldBeAuthenticatedForLevel = false;
        Bluebird.each(HIERARCHY, auth => {
            if (auth === authId) {
                // we have iterated to the correct level, it should be authenticated
                // for all levels and up
                shouldBeAuthenticatedForLevel = true;
            }
            return checkAuthorization(auth, httpVerb, controller, shouldBeAuthenticatedForLevel);
        }).nodeify(done);
    });
}

describe('Security', () => {
    beforeEach(() => loadFixtures([
        'systems.json',
        'api-tokens.json'
    ]));
    describe('Account API', () => {
        testSecurity('/account', 'GET', MODERATOR);
    });
    describe('API Token API', () => {
        testSecurity('/1/api-tokens', 'GET', MODERATOR);
        testSecurity('/1/api-tokens', 'POST', MODERATOR);
        testSecurity('/1/api-tokens', 'DELETE', MODERATOR);
    });
    describe('Customer Roles API', () => {
        testSecurity('/1/roles', 'GET', MODERATOR);
        testSecurity('/1/roles', 'POST', MODERATOR);
        testSecurity('/1/roles', 'PUT', MODERATOR);
        testSecurity('/1/roles', 'DELETE', MODERATOR);
    });
    describe('Customer API', () => {
        testSecurity('/1/customers', 'GET', TOKEN);
        testSecurity('/1/customers/1', 'GET', TOKEN);
        testSecurity('/1/customers', 'POST', TOKEN);
        testSecurity('/1/customers/1', 'PUT', TOKEN);
        testSecurity('/1/customers/1', 'DELETE', MODERATOR);
    });
    describe('Nerd API', () => {
        testSecurity('/nerd', 'GET', TOKEN);
        testSecurity('/nerd/username', 'GET', TOKEN);
    });
    describe('Products API', () => {
        testSecurity('/1/products', 'GET', TOKEN);
        testSecurity('/1/products/1', 'GET', TOKEN);
        testSecurity('/1/products', 'POST', MODERATOR);
        testSecurity('/1/products/1', 'DELETE', MODERATOR);
    });
    describe('System Role API', () => {
        testSecurity('/1/users/1', 'POST', ADMINISTRATOR);
        testSecurity('/1/users/1', 'PUT', ADMINISTRATOR);
        testSecurity('/1/users/1', 'DELETE', ADMINISTRATOR);
    });
    describe('System API', () => {
        testSecurity('/systems', 'GET', TOKEN);
        testSecurity('/systems/1', 'GET', TOKEN);
        testSecurity('/systems', 'POST', ADMINISTRATOR);
        testSecurity('/systems/1', 'PUT', ADMINISTRATOR);
    });
    describe('Transaction API', () => {
        testSecurity('/1/transactions', 'GET', MODERATOR);
        testSecurity('/1/transactions/1', 'GET', MODERATOR);
        testSecurity('/1/transactions', 'POST', TOKEN);
    });
    describe('Users API', () => {
        testSecurity('/users', 'GET', ADMINISTRATOR);
        testSecurity('/users/1/systems', 'GET', ADMINISTRATOR);
        testSecurity('/users/1', 'GET', ADMINISTRATOR);
        testSecurity('/users', 'GET', ADMINISTRATOR);
        testSecurity('/users/1', 'PUT', ADMINISTRATOR);
        testSecurity('/users/1', 'DELETE', ADMINISTRATOR);
    });
});
