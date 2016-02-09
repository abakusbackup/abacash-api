import chai from 'chai';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../src/app';
import { loadFixtures } from '../helpers';

chai.should();

describe('APIToken API', () => {
    beforeEach(() => loadFixtures());

    describe('Creating a token', () => {
        it('should return a valid token for valid credentials', done => {
            const credentials = {
                email: 'test@abakus.no',
                password: 'test'
            };

            request(app)
            .post('/authenticate/')
            .send(credentials)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const { token } = res.body;
                const decoded = jwt.decode(token);
                decoded.email.should.equal(credentials.email);
                // Sub should equal the database id, which is 1:
                decoded.sub.should.equal(1);
                done();
            });
        });

        function testBadPayload(payload, done) {
            request(app)
            .post('/authenticate/')
            .send(payload)
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                const error = res.body;
                error.message.should.equal('Authentication requires both email and password');
                done();
            });
        }

        it('should return an error for payloads missing email', done => {
            const credentials = { password: 'test' };
            testBadPayload(credentials, done);
        });

        it('should return an error for payloads missing password', done => {
            const credentials = { email: 't@t.com' };
            testBadPayload(credentials, done);
        });

        it('should return an error for wrong passwords', done => {
            const credentials = {
                email: 'test@abakus.no',
                password: 'wrong'
            };

            request(app)
            .post('/authenticate/')
            .send(credentials)
            .expect('Content-Type', /json/)
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                const error = res.body;
                error.message.should.equal('Invalid credentials provided');
                done();
            });
        });

        it('should return a non-revealing error for invalid emails', done => {
            const credentials = {
                email: 'bademail@abakus.no',
                password: 'something'
            };

            request(app)
            .post('/authenticate/')
            .send(credentials)
            .expect('Content-Type', /json/)
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                const error = res.body;
                error.message.should.equal('Invalid credentials provided');
                done();
            });
        });
    });
});
