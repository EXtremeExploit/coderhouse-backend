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
        if (newProduct.code && newProduct.id && newProduct.title && newProduct.description && newProduct.price && newProduct.thumbnail && newProduct.code && newProduct.stock) {
            const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
            const indice = prods.findIndex(prod => prod.code === newProduct.code)
            if (indice === -1) {
                prods.push(newProduct);
                await fs.writeFile(this.path, JSON.stringify(prods))
                console.log('Producto creado correctamente')
            } else {
                console.log('Producto ya existe en este array')
            }
        } else {
            console.log('Debe ingresar un producto con todas las propiedades')
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
            console.log('Producto actualizado correctamente')
        } else {
            console.log('Producto no existe')
        }

    }

    async deleteProduct(id) {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const indice = prods.findIndex(producto => producto.id === id)
        if (indice != -1) {
            const prodsFiltrados = prods.filter(prod => prod.id != id)
            await fs.writeFile(this.path, JSON.stringify(prodsFiltrados))
            console.log('Producto eliminado correctamente')
        } else {
            console.log('Producto no existe')
        }

    }
}