import crypto from 'crypto';

export class ProductManager {
    constructor() {
        this.products = [];
    }

    addProduct(product) {
        if (!product.title ||
            !product.description ||
            product.price == null || typeof product.price == 'undefined' || // 0 es un precio valido. por si es gratis
            !product.thumbnail ||
            product.stock == null || typeof product.stock == 'undefined' // 0 es un stock valido. por si no hay mas
        ) {
            return 'Producto no valido'
        }


        const exists = this.products.includes((prod) => prod.code === product.code);

        if (exists) {
            return 'Producto ya existe';
        } else {
            product.code = crypto.randomBytes(8).toString('hex');
            this.products.push(product);
        }
    }

    getProducts() {
        return this.products;
    }

    getProducById(code) {
        let f = this.products.find((p) => p.code == code);

        if (typeof f == 'undefined') {
            console.error('Not found');
        } else {
            return f;
        }
    }


}