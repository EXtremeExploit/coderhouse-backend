import crypto from 'crypto';
import { promises as fs } from 'fs'
import { ProductManager } from './ProductManager.js';

export class CartManager {
    constructor(path) {
        this.path = path;
    }

    async createCart() {
        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'));

        const id = crypto.randomBytes(10).toString('hex');
        carts.push({ id: id, products: [] });

        fs.writeFile(this.path, JSON.stringify(carts));
        return id;
    }

    async getCart(cid) {
        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        return carts.find((c) => c.id == cid);
    }

    async addProductByCart(cid, pid, quantityParam) {
        const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'));

        const cartI = carts.findIndex((c) => c.id == cid);

        if (cartI == -1)
            return { status: 404, msg: `Carrito con id ${cid} no encontrado` };

        const pm = new ProductManager('src/data/products.json');
        if (typeof await pm.getProductById(pid) == 'undefined')
            return { status: 404, msg: `Producto con id ${pid} no encontrado` };

        const i = carts[cartI].products.findIndex((product) => product.product == pid);

        if (i != -1)
            carts[cartI].products[i].quantity += (quantityParam ?? 1); // 1 si la cantidad no esta establecida
        else
            carts[cartI].products.push({ product: pid, quantity: quantityParam ?? 1 }); // 1 si la cantidad no esta establecida

        await fs.writeFile(this.path, JSON.stringify(carts));
        return { status: 200, msg: `Producto con id "${pid}" agregado correctamente al carrito con id ${cid}` };
    }

}