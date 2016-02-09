import chai from 'chai';
import request from 'supertest';
import app from '../../src/app';
import { loadFixtures, testUnauthenticated, createAuthToken } from '../helpers';

const should = chai.should();

describe('Users API', () => {
    beforeEach(() => loadFixtures());

    describe('List', () => {
        it('should not be possible to list users without a valid token', done => {
            testUnauthenticated('/users', done);
        });

        it('should list users', done => {
            request(app)
            .get('/users')
            .set('Authorization', createAuthToken())
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const users = res.body;
                users.length.should.equal(2);
                should.exist(users[0].id);
                should.not.exist(users[0].hash);
                done();
            });
        });
    });

    describe('Retrieve', () => {
        it('should not be possible to retrieve users without a valid token', done => {
            testUnauthenticated('/users/1', done);
        });

        it('should retrieve a user', done => {
            request(app)
            .get('/users/1')
            .set('Authorization', createAuthToken())
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const user = res.body;
                user.name.should.equal('Test Bruker');
                should.not.exist(user.hash);
                done();
            });
        });
    });

    describe('Create', () => {
        it('should not be possible to create users without a valid token', done => {
            testUnauthenticated('/users', done, 'post');
        });

        it('should create a user', done => {
            const payload = {
                email: 'test@test.com',
                name: 'testuser',
                password: 'testpassword'
            };

            request(app)
            .post('/users')
            .send(payload)
            .set('Authorization', createAuthToken())
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                const user = res.body;
                user.name.should.equal(payload.name);
                should.not.exist(user.hash);
                done();
            });
        });

        it('should create a user and add a system to it', done => {
            const payload = {
                email: 'test@test.com',
                name: 'testuser',
                password: 'testpassword',
                systemId: 1
            };

            request(app)
            .post('/users')
            .send(payload)
            .set('Authorization', createAuthToken())
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                const user = res.body;
                user.name.should.equal(payload.name);
                user.role.should.equal('USER');
                done();
            });
        });
    });

    describe('Update', () => {
        it('should not be possible to update users without a valid token', done => {
            testUnauthenticated('/users/1', done, 'put');
        });

        it('should update a user', done => {
            const payload = {
                email: 'test@test.com',
                name: 'newname',
                password: 'testpassword'
            };

            request(app)
            .put('/users/1')
            .send(payload)
            .set('Authorization', createAuthToken())
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const user = res.body;
                user.name.should.equal(payload.name);
                should.not.exist(user.hash);
                done();
            });
        });
    });

    describe('Retrieve current user', () => {

        it('should retrieve a user', done => {
            request(app)
            .get('/users/1')
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const user = res.body;
                user.name.should.equal('Test Bruker');
                should.not.exist(user.hash);
                done();
            });
        });
        
    });

});
