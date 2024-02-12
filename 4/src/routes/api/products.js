import { Router } from 'express';
import { ProductManager } from '../../ProductManager.js';

const pm = new ProductManager('src/data/products.json');
const router = Router();

router.get('/', async (req, res) => {
    const products = await pm.getProducts();

    const { limit } = req.query;
    const slicedProds = products.slice(0, limit ?? Infinity);

    res.status(200).send(slicedProds);
});

router.post('/', async (req, res) => {
    try {
        const product = req.body;
        const result = await pm.addProduct(product);
        res.status(result.status).send(result.msg);
    } catch (error) {
        res.status(500).send(`Error interno del servidor al obtener productos: ${error}`)
    }
});


router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await pm.getProductById(pid);
        if (typeof product == 'undefined')
            res.status(404).send({ error: `Producto con id '${pid}' no encontrado` });
        else
            res.status(200).send(product);
    } catch (error) {
        res.status(500).send(`Error interno del servidor al obtener producto: ${error}`)
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updateProduct = req.body;
        const result = await pm.updateProduct(pid, updateProduct);
        if (result)
            res.status(200).send(`Producto con id ${pid} actualizado correctamente`);
        else
            res.status(404).send({ error: `Producto con id '${pid}' no encontrado` });
    } catch (e) {
        res.status(500).send(`Error interno del servidor al actualizar producto: ${error}`);
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const result = await pm.deleteProduct(pid);
        if (result)
            res.status(200).send(`Producto con id ${pid} eliminado correctamente`);
        else
            res.status(404).send({ error: `Producto con id '${pid}' no encontrado` });
    } catch (error) {
        res.status(500).send(`Error interno del servidor al eliminar producto: ${error}`)
    }
});

export default router;