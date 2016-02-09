import chai from 'chai';
import request from 'supertest';
import app from '../../src/app';
import { loadFixtures, createAuthToken } from '../helpers';

const should = chai.should();

describe('Customer Role API', () => {
    beforeEach(() => loadFixtures());

    describe('List Roles', () => {
        it('should list roles', done => {
            request(app)
            .get('/1/roles')
            .set('Authorization', createAuthToken())
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const roles = res.body;
                roles.length.should.equal(3);
                roles[0].id.should.equal(1);
                done();
            });
        });
    });

    describe('Create Role', () => {
        it('should create a role', done => {
            const payload = {
                role: 'something',
                internalSales: true,
                isSeller: true
            };

            request(app)
            .post('/1/roles')
            .send(payload)
            .set('Authorization', createAuthToken())
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                const role = res.body;
                should.exist(role.id);
                role.role.should.equal(payload.role);
                role.internalSales.should.equal(payload.internalSales);
                role.isSeller.should.equal(payload.isSeller);
                done();
            });
        });
    });

    describe('Update Role', () => {
        it('should update a role', done => {
            const payload = {
                role: 'changed'
            };

            request(app)
            .put('/1/roles/1')
            .send(payload)
            .set('Authorization', createAuthToken())
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const role = res.body;
                role.role.should.equal(payload.role);
                done();
            });
        });

        it('should return 404 for invalid roles', done => {
            const payload = {
                role: 'changed'
            };

            request(app)
            .put('/1/roles/1337')
            .send(payload)
            .set('Authorization', createAuthToken())
            .expect('Content-Type', /json/)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                const error = res.body;
                error.message.should.equal('Could not find the entity');
                done();
            });
        });
    });

    describe('Delete Role', () => {
        it('should delete a role', done => {
            request(app)
            .delete('/1/roles/1')
            .set('Authorization', createAuthToken())
            .expect(204)
            .end((err, res) => done(err));
        });
    });
});
