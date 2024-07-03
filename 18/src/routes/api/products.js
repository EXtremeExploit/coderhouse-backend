import { Router } from 'express';
import { createProduct, deleteProduct, getProductById, getProducts, updateProductById } from '../../controllers/product.js';

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

        const products = await getProducts(limit, page, query, sort);

        res.status(200).send(products);
    } catch (error) {
        req.logger.error(error);
        res.status(500).send(`Error interno del servidor al obtener productos: ${error}`)
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await getProductById(pid);
        if (product)
            res.status(200).send(product);
        else
            res.status(404).send({ error: `Producto con id '${pid}' no encontrado` });
    } catch (error) {
        req.logger.error(error);
        res.status(500).send(`Error interno del servidor al obtener producto: ${error}`)
    }
});


router.post('/', async (req, res) => {
    try {
        const product = req.body;
        if (req.user?.rol == 'Admin' || req.user?.rol == 'Premium') {
            product.owner = req.user?.email;
            const result = await createProduct(product);
            res.status(result.status).send(result);
        } else {
            res.send(403).send('No autorizado');
        }
    } catch (error) {
        req.logger.error(error);
        res.status(500).send(`Error interno del servidor al crear producto: ${error}`)
    }
});


router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updateProduct = req.body;

        let canUpdateProduct = false;
        let prod = await getProductById(pid);
        if (prod.owner == req.user?.email)
            canUpdateProduct = true;

        if (req.user?.rol == 'Admin' || canUpdateProduct) {
            const prod = await updateProductById(pid, updateProduct);
            res.status(200).send(prod);
        } else {
            res.status(403).send('No autorizado')
        }
    } catch (error) {
        req.logger.error(error);
        res.status(500).send(`Error interno del servidor al actualizar producto: ${error}`);
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;

        let canDeleteProduct = false;
        let prod = await getProductById(pid);
        if (prod.owner == req.user?.email)
            canDeleteProduct = true;


        if (req.user?.rol == 'Admin' || canDeleteProduct) {
            const result = await deleteProduct(pid);
            res.status(200).send(result);
        } else {
            res.status(403).send('No autorizado');
        }

    } catch (error) {
        req.logger.error(error);
        res.status(500).send(`Error interno del servidor al eliminar producto: ${error}`)
    }
});

export default router;