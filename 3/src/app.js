import express from 'express';
import { ProductManager } from "./ProductManager.js";

const app = express();
const PORT = process.env.PORT ?? 8080;

app.get('/', (req, res) => {
    res.send('o/');
});


app.get('/products', async (req, res) => {
    const pm = new ProductManager('./products.json');
    const products = await pm.getProducts();

    const { limit } = req.query;
    const slicedProds = products.slice(0, limit ?? Infinity);

    res.status(200).send(slicedProds);
});


app.get('/products/:pid', async (req, res) => {
    const pm = new ProductManager('./products.json');
    const { pid } = req.params;
    const product = await pm.getProductById(pid);
    if (typeof product == 'undefined')
        res.status(404).send({ error: `Producto con id '${pid}' no encontrado` });
    else
        res.status(200).send(product);
});

app.listen(PORT, () => {
    console.log('Listening on port: ' + PORT);
});
