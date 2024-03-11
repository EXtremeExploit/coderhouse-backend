import { Router } from 'express';
import cartModel from '../../models/cart.js';
// import { CartManager } from '../../CartManager.js';


// const cm = new CartManager('src/data/cart.json');
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


export default router;