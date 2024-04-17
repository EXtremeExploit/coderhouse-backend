import { Router } from 'express';
import productModel from '../../models/products.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        let { limit, page, query, sort } = req.query;

        let metFilter;
        if (query == 'true' || query == 'false') {
            metFilter = 'status'
        } else {
            if (query !== undefined)
                metFilter = 'category';
        }

        query = metFilter != undefined ? { [metFilter]: query } : {};

        limit = limit ?? 10;
        page = page ?? 1;
        sort = sort ?? 'asc';

        const products = await productModel.paginate(query, { limit, page, sort: { price: sort } });

        res.status(200).send(products);
    } catch (error) {
        res.status(500).send(`Error interno del servidor al obtener productos: ${error}`)
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productModel.findById(pid);
        if (prod)
            res.status(200).send(product);
        else
            res.status(404).send({ error: `Producto con id '${pid}' no encontrado` });
    } catch (error) {
        res.status(500).send(`Error interno del servidor al obtener producto: ${error}`)
    }
});


router.post('/', async (req, res) => {
    try {
        const product = req.body;
        const result = await productModel.create(product);
        res.status(result.status).send(result);
    } catch (error) {
        res.status(500).send(`Error interno del servidor al crear producto: ${error}`)
    }
});


router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updateProduct = req.body;
        const prod = await productModel.findByIdAndUpdate(pid, updateProduct);
        res.status(200).send(prod);
    } catch (e) {
        res.status(500).send(`Error interno del servidor al actualizar producto: ${error}`);
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const result = await productModel.findByIdAndDelete(pid);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(`Error interno del servidor al eliminar producto: ${error}`)
    }
});

export default router;