import request from 'supertest';
import jwt from 'jsonwebtoken';
import sequelizeFixtures from 'sequelize-fixtures';
import db from '../src/models';
import app from '../src/app';
import { syncDB } from '../src/model-helpers';
import config from '../src/config';
import tokens from './fixtures/api-tokens.json';
import * as authConstants from '../src/auth/constants';

export function loadFixtures(fixtures) {
  const f = fixtures || [
    'api-tokens.json',
    'customer-roles.json',
    'customers.json',
    'product-groups.json',
    'products.json',
    'transactions.json',
    'users.js'
  ];
  const fixturePaths = f.map(file => `./test/fixtures/${file}`);
  return syncDB({ force: true })
    .then(() =>
      sequelizeFixtures.loadFiles(fixturePaths, db, { log: string => null })
    )
    .catch(err => {
      console.log(err);
    });
}

function createAPIToken() {
  return `Token ${tokens[0].data.token}`;
}

function createModeratorToken() {
  const token = jwt.sign(
    {
      isAdmin: false
    },
    config.jwtSecret,
    {
      expiresIn: '7 days',
      subject: '1' // fake user id
    }
  );
  return `Bearer ${token}`;
}

function createAdministratorToken() {
  const token = jwt.sign(
    {
      isAdmin: true
    },
    config.jwtSecret,
    {
      expiresIn: '7 days',
      subject: '1' // fake user id
    }
  );
  return `Bearer ${token}`;
}

export function createAuthorization(auth) {
  switch (auth) {
    case authConstants.TOKEN:
      return createAPIToken();
    case authConstants.MODERATOR:
      return createModeratorToken();
    case authConstants.ADMINISTRATOR:
      return createAdministratorToken();
    default:
      return '';
  }
}

export function test404(url, done, headers, method = 'get') {
  const requestMethod = request(app)[method];
  requestMethod(url)
    .expect('Content-Type', /json/)
    .set(headers)
    .expect(404)
    .end((err, res) => {
      if (err) return done(err);
      res.body.message.should.equal('Could not find the entity');
      done();
    });
}
