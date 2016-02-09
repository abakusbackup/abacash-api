import chai from 'chai';
import request from 'supertest';
import app from '../../src/app';
import { loadFixtures, createAuthToken, getAPIToken } from '../helpers';

chai.should();

describe('Product API', () => {
    describe('List all products', () => {
        beforeEach(() => loadFixtures());

        it('should list all products', done => {
            request(app)
            .get('/1/products/')
            .set('Authorization', getAPIToken())
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const products = res.body;
                products.length.should.equal(3);
                products[0].id.should.equal(1);
                products[0].name.should.equal('Test product 1');
                done();
            });
        });

        it('should keep systems separate all products', done => {
            request(app)
            .get('/2/products/')
            .set('Authorization', getAPIToken())
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const products = res.body;
                products.length.should.equal(2);
                products[0].id.should.equal(4);
                done();
            });
        });
    });

    describe('List active products', () => {
        beforeEach(() => loadFixtures());

        it('should list active products', done => {
            request(app)
            .get('/1/products/?active=true')
            .set('Authorization', getAPIToken())
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const products = res.body;
                products.length.should.equal(3);
                done();
            });
        });
    });

    describe('List all active products of type', () => {
        beforeEach(() => loadFixtures());

        it('should list active products', done => {
            request(app)
            .get('/1/products/?type=Type 2&active=true')
            .set('Authorization', getAPIToken())
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const products = res.body;
                products.length.should.equal(1);
                products[0].type.should.equal('Type 2');
                done();
            });
        });
    });

    describe('List a single product', () => {
        beforeEach(() => loadFixtures());

        it('should return a product from a current system', done => {
            request(app)
            .get('/1/products/1')
            .set('Authorization', getAPIToken())
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                res.body.name.should.equal('Test product 1');
                done();
            });
        });

        it('should return 404 on product that doesn\'t exist', done => {
            request(app)
            .get('/1/products/1337')
            .set('Authorization', getAPIToken())
            .expect(404, done);
        });

        it('should return 404 on product that exists, but are not in the current system.', done => {
            request(app)
            .get('/1/products/4')
            .set('Authorization', getAPIToken())
            .expect(404, done);
        });
    });

    describe('Create products', () => {
        beforeEach(() => loadFixtures());

        it('should create a product', done => {
            request(app)
            .post('/1/products')
            .send({
                type: 'Created Type',
                price: 1337.99,
                internalPrice: 1337.00,
                name: 'Created Product',
                active: true,
                stock: 0
            })
            .set('Authorization', createAuthToken())
            .expect(201, done);
        });
    });

    describe('Destroy product', () => {
        beforeEach(() => loadFixtures());

        it('should delete an existing product', done => {
            request(app)
            .delete('/1/products/1')
            .set('Authorization', createAuthToken())
            .expect(204, done);
        });
        it('should return not found if product not found', done => {
            request(app)
            .delete('/1/products/4')
            .set('Authorization', createAuthToken())
            .expect(404, done);
        });
    });
});
