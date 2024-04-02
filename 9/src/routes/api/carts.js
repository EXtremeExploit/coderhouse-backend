import { Router } from 'express';
import cartModel from '../../models/cart.js';

const router = Router();

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartModel.findOne({ _id: cid });
        res.status(200).send(cart.products);
    } catch (error) {
        res.status(500).send(`Error interno del servidor al consultar carrito: ${error}`)
    }
});


router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        const msg = await cartModel.findByIdAndUpdate(cid, { products: [] });

        res.status(200).send(msg);
    } catch (error) {
        res.status(500).send(`Error interno del servidor al agregar producto al carrito: ${error}`);
    }
});


router.put('/:cid', async (req, res) => {
    try {
        const body = req.body;

        const msg = await cartModel.findByIdAndUpdate(cid, { products: body });

        res.status(200).send(msg);
    } catch (error) {
        res.status(500).send(`Error interno del servidor al agregar producto al carrito: ${error}`);
    }
});

router.post('/', async (req, res) => {
    try {
        const cartId = await cartModel.create({ products: [] });
        res.status(200).send(`Carrito con id "${cartId._id}" creado`);
    } catch (error) {
        res.status(500).send(`Error interno del servidor al crear carrito: ${error}`);
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cart = await cartModel.findById(cid);

        const i = cart.products.findIndex((p) => p.id_prod == pid);

        if (i != -1) {
            cart.products[i].quantity += (quantity ?? 1);
        } else {
            cart.products.push({ id_prod: pid, quantity: quantity });
        }

        const msg = cartModel.findByIdAndUpdate(cid, cart);
        res.status(200).send(msg);
    } catch (error) {
        res.status(500).send(`Error interno del servidor al agregar producto al carrito: ${error}`);
    }
});


router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cart = await cartModel.findById(cid);

        const i = cart.products.findIndex((p) => p.id_prod == pid);

        if (i != -1) {
            cart.products[i].quantity = quantity;
        }

        const msg = cartModel.findByIdAndUpdate(cid, cart);
        res.status(200).send(msg);
    } catch (error) {
        res.status(500).send(`Error interno del servidor al agregar producto al carrito: ${error}`);
    }
});


router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await cartModel.findById(cid);

        const i = cart.products.findIndex((p) => p.id_prod == pid);

        if (i != -1) {
            cart.products.splice(i, 1);
        }

        const msg = cartModel.findByIdAndUpdate(cid, cart);
        res.status(200).send(msg);
    } catch (error) {
        res.status(500).send(`Error interno del servidor al eliminar producto del carrito: ${error}`);
    }
});


export default router;