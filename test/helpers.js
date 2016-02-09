import request from 'supertest';
import jwt from 'jsonwebtoken';
import sequelizeFixtures from 'sequelize-fixtures';
import db from '../src/models';
import app from '../src/app';
import { syncDB } from '../src/model-helpers';
import config from '../src/config';
import tokens from './fixtures/api-tokens.json';

export function loadFixtures(fixtures) {
    const f = fixtures || [
        'systems.json',
        'api-tokens.json',
        'customer-roles.json',
        'customers.json',
        'products.json',
        'transactions.json',
        'users.js'
    ];
    const fixturePaths = f.map(file => `./test/fixtures/${file}`);
    return syncDB({ force: true })
    .then(() => sequelizeFixtures.loadFiles(fixturePaths, db));
}

export function createAuthToken() {
    const token = jwt.sign({}, config.jwtSecret, {
        expiresIn: '7 days',
        subject: 1 // fake user id
    });
    return `Bearer ${token}`;
}

export function getAPIToken() {
    return `Token ${tokens[0].data.token}`;
}

export function test404(url, done, authorization, method = 'get') {
    const requestMethod = request(app)[method];
    requestMethod(url)
        .expect('Content-Type', /json/)
        .set('Authorization', authorization)
        .expect(404)
        .end((err, res) => {
            if (err) return done(err);
            res.body.message.should.equal('Could not find the entity');
            done();
        });
}

export function testUnauthenticated(url, done, method = 'get') {
    const requestMethod = request(app)[method];
    requestMethod(url)
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
            if (err) return done(err);
            res.body.message.should.equal('No authorization token was found');
            done();
        });
}
