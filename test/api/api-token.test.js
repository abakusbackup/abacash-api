import chai from 'chai';
import request from 'supertest';
import app from '../../src/app';
import { loadFixtures, test404, createAuthToken } from '../helpers';

chai.should();

describe('APIToken API', () => {
    describe('List all tokens', () => {
        beforeEach(() => loadFixtures());

        it('should list all tokens', done => {
            request(app)
            .get('/api-tokens/')
            .set('Authorization', createAuthToken())
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const tokens = res.body;
                const [token] = tokens;
                tokens.length.should.equal(2);
                token.id.should.equal(1);
                token.name.should.equal('test token');
                done();
            });
        });
    });

    describe('Create token', () => {
        it('should generate a new token', done => {
            const body = {
                name: 'test',
                systemId: 1
            };

            request(app)
            .post('/api-tokens')
            .send(body)
            .set('Authorization', createAuthToken())
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                const auth = res.body;
                auth.token.length.should.equal(32);
                auth.name.should.equal(body.name);
                done();
            });
        });

        it('should return a validation error for missing info', done => {
            const auth = {
                systemId: 1
            };

            request(app)
            .post('/api-tokens/')
            .send(auth)
            .set('Authorization', createAuthToken())
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                res.body.message.should.equal('notNull Violation: name cannot be null');
                res.body.errors.length.should.equal(1);
                done();
            });
        });
    });

    describe('Delete token', () => {
        beforeEach(() => loadFixtures());

        it('should delete a token', done => {
            request(app)
            .delete('/api-tokens/1')
            .set('Authorization', createAuthToken())
            .expect(204)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
        });

        it('should return 404 for missing tokens', done => {
            test404('/api-tokens/1337', done, createAuthToken(), 'delete');
        });
    });
});
