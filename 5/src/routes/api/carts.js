import { Router } from 'express';
import { CartManager } from '../../CartManager.js';

const cm = new CartManager('src/data/cart.json');
const router = Router();

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cm.getCart(cid)
        if (cart)
            res.status(200).send(cart.products);
        else
            res.status(404).send(`Carrito con id "${cid}" no encontrado`);
    } catch (error) {
        res.status(500).send(`Error interno del servidor al consultar carrito: ${error}`)
    }
});

router.post('/', async (req, res) => {
    try {
        const cartId = await cm.createCart();
        res.status(200).send(`Carrito con id "${cartId}" creado`);
    } catch (error) {
        res.status(500).send(`Error interno del servidor al crear carrito: ${error}`);
    }
});


router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const result = await cm.addProductByCart(cid, pid, quantity);
        res.status(result.status).send(result.msg);
    } catch (error) {
        res.status(500).send(`Error interno del servidor al agregar producto al carrito: ${error}`);
    }
});


export default router;