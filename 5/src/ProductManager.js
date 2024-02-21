import crypto from 'crypto';
import { promises as fs } from 'fs'

export class ProductManager {
    constructor(path) {
        this.path = path;
    }

    /**
     * @returns {[]}
     */
    async getProducts() {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        return prods;
    }

    async getProductById(id) {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const prod = prods.find(producto => producto.id === id)
        return prod;
    }

    async addProduct(newProduct) {
        if (
            newProduct.title &&
            newProduct.description &&
            newProduct.code &&
            newProduct.price &&
            newProduct.stock &&
            newProduct.category
        ) {
            const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
            const indice = prods.findIndex(prod => prod.code === newProduct.code)
            if (indice === -1) {
                if (!newProduct.thumbnail) newProduct.thumbnail = [];
                newProduct.id = crypto.randomBytes(10).toString('hex');
                newProduct.status = true;
                prods.push(newProduct);
                await fs.writeFile(this.path, JSON.stringify(prods));
                return { msg: newProduct.id, status: 200 };
            } else {
                return { msg: `Producto ya con codigo "${newProduct.code}" existe en este array`, status: 400 };
            }
        } else {
            return { msg: `Debe ingresar un producto con todas las propiedades`, status: 400 };
        }
    }

    async updateProduct(id, nuevoProducto) {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const indice = prods.findIndex(producto => producto.id === id)
        if (indice != -1) {
            prods[indice].stock = nuevoProducto.stock
            prods[indice].price = nuevoProducto.price
            prods[indice].title = nuevoProducto.title
            prods[indice].thumbnail = nuevoProducto.thumbnail
            prods[indice].description = nuevoProducto.description
            prods[indice].code = nuevoProducto.code
            await fs.writeFile(this.path, JSON.stringify(prods))
            return true;
        } else {
            return false;
        }
    }

    async deleteProduct(id) {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const indice = prods.findIndex(producto => producto.id === id)
        if (indice != -1) {
            const prodsFiltrados = prods.filter(prod => prod.id != id)
            await fs.writeFile(this.path, JSON.stringify(prodsFiltrados))
            return true;
        } else {
            return false;
        }

    }
}