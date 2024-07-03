import mongoose from 'mongoose'
import config from '../src/config.js';
import supertest from 'supertest'
import { expect } from 'chai';

import { app } from '../src/app.js';

await mongoose.connect(config.mongo_url);

const requester = supertest.agent(app);

describe('Tests', function () {
    describe('Products routes', async function () {
        let primerProdNombre = null;
        let primerProdCategoria = '';

        it('Obtener todos los productos en primera pagina', async () => {
            const req = await requester.get('/api/products/');
            expect(req.status).to.equal(200);
            expect(typeof req.body).to.be.equal('object');
            expect(typeof req.body.docs).to.be.equal('object');

            expect(req.body.docs.length).to.be.greaterThan(0);

            primerProdNombre = req.body.docs[0]._id;
            primerProdCategoria = req.body.docs[0].category;
        });

        it('Obtener productos por categoria', async () => {
            const req = await requester.get(`/api/products/?query=${primerProdCategoria}`);
            expect(req.status).to.equal(200);
            expect(typeof req.body).to.be.equal('object');
            expect(typeof req.body.docs).to.be.equal('object');

            expect(req.body.docs.length).to.be.greaterThan(0);

            for (let i = 0; i < req.body.docs.length; i++)
                expect(req.body.docs[i].category).to.be.equal(primerProdCategoria);
        });

        it('Obtener el primer producto', async () => {
            const req = await requester.get(`/api/products/${primerProdNombre}`);
            expect(req.status).to.equal(200);
            expect(typeof req.body).to.be.equal('object');

            expect(req.body._id).to.be.equal(primerProdNombre);
        });
    });

    describe('Session routes', function () {
        const testUser = {
            first_name: 'Test',
            last_name: 'TestLast',
            email: 'test@example.com',
            password: 'mares',
            age: 20
        }

        it('Register', async () => {
            const req = await requester.post('/api/session/register').send(testUser);
            expect(req.status).to.equal(200);
        });

        it('Login', async () => {
            const req = await requester.post('/api/session/login').send(testUser);
            expect(req.status).to.equal(302); // 302 porque es un  redirect
        });

        it('Borrar usuario', async () => {
            const req = await requester.get('/api/session/destroy');
            expect(req.status).to.equal(200);
        });
    });


    describe('Cart routes', function () {
        const testUser = {
            first_name: 'Test',
            last_name: 'TestLast',
            email: 'test@example.com',
            password: 'mares',
            age: 20
        }

        let prod = null;
        let cid = '';

        it('Register', async () => {
            const req = await requester.post('/api/session/register').send(testUser);
            expect(req.status).to.equal(200);
        });

        it('Login', async () => {
            const req = await requester.post('/api/session/login').send(testUser);
            expect(req.status).to.equal(302); // 302 porque es un  redirect
        });


        it('Obtener un producto', async () => {
            const req = await requester.get('/api/products/?limit=1');
            expect(req.status).to.equal(200);
            expect(typeof req.body).to.be.equal('object');
            expect(typeof req.body.docs).to.be.equal('object');

            expect(req.body.docs.length).to.be.greaterThan(0);

            prod = req.body.docs[0]._id;
        });

        it('Obtener cartId', async () => {
            const req = await requester.get('/api/session/current');
            expect(req.status).to.equal(200);
            expect(typeof req.body.cartId).to.equal('string');

            cid = req.body.cartId;
        });


        it('Agregar producto a carrito', async () => {
            const req = await requester.post(`/api/carts/${cid}/product/${prod}`).send({ quantity: 2 });
            expect(req.status).to.equal(200);
        });

        it('Corraborar que el producto fue agregado', async () => {
            const req = await requester.get(`/api/carts/${cid}`);
            expect(req.status).to.equal(200);
            const i = req.body.findIndex((p) => p.id_prod._id == prod);
            expect(i).to.be.greaterThan(-1);
        })

        it('Borrar usuario', async () => {
            const req = await requester.get('/api/session/destroy');
            expect(req.status).to.equal(200);
        });
    });
});
