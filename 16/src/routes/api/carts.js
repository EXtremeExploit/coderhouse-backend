import { Router } from 'express';
import { addProduct, deleteCart, deleteProduct, getCart, purchase, setProduct, updateCart } from '../../controllers/cart.js';

const router = Router();

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        if (req.user?.cartId == cid) {
            const cart = await getCart(cid);
            res.status(200).send(cart.products);
        } else {
            res.status(403).send('No autorizado');
        }
    } catch (error) {
        req.error(error);
        res.status(500).send(`Error interno del servidor al consultar carrito: ${error}`)
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        if (req.user?.cartId == cid) {
            const msg = await deleteCart(cid);
            res.status(200).send(msg);
        } else {
            res.status(403).send('No autorizado');

        }
    } catch (error) {
        req.error(error);
        res.status(500).send(`Error interno del servidor al borrar todos los productos del carrito: ${error}`);
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const body = req.body;
        if (req.user?.cartId == cid) {
            const msg = await updateCart(cid, body);
            res.status(200).send(msg);
        } else {
            res.status(403).send('No autorizado');
        }
    } catch (error) {
        req.error(error);
        res.status(500).send(`Error interno del servidor al agregar producto al carrito: ${error}`);
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        let prod = await getProductById(pid);
        let canAddToCart = true;
        if (prod.owner == req.user?.email)
            canAddToCart = false;

        if (req.user?.cartId == cid && canAddToCart == true) {
            const msg = await addProduct(cid, pid, quantity);
            res.status(200).send(msg);
        } else {
            res.status(403).send('No autorizado');
        }
    } catch (error) {
        req.error(error);
        res.status(500).send(`Error interno del servidor al agregar producto al carrito: ${error}`);
    }
});

router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;


        let prod = await getProductById(pid);
        let canAddToCart = true;
        if (prod.owner == req.user?.email)
            canAddToCart = false;


        if (req.user?.cartId == cid && canAddToCart == true) {
            const msg = await setProduct(cid, pid, quantity);
            res.status(200).send(msg);
        } else {
            res.status(403).send('No autorizado');
        }
    } catch (error) {
        req.error(error);
        res.status(500).send(`Error interno del servidor al agregar producto al carrito: ${error}`);
    }
});


router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        if (req.user?.cartId == cid) {
            const msg = await deleteProduct(cid, pid);
            res.status(200).send(msg);
        } else {
            res.status(403).send('No autorizado');
        }
    } catch (error) {
        req.error(error);
        res.status(500).send(`Error interno del servidor al eliminar producto del carrito: ${error}`);
    }
});

router.post('/:cid/purchase', async (req, res) => {
    try {
        const { cid } = req.params;
        if (req.user?.cartId == cid) {
            const msg = purchase(cid, req.user.email);
            res.status(200).send(msg);
        } else {
            res.status(403).send('No autorizado');
        }
    } catch (error) {
        req.error(error);
        res.status(500).send(`Error interno del servidor al comprar productos del carrito: ${error}`);
    }
});


export default router;