import { Product } from "./Product.js";
import { ProductManager } from "./ProductManager.js";

const producto1 = new Product("Arroz", "Muy rico", 1200, 20, "A123")
const producto2 = new Product("Lentejas", "Sanas", 1500, 25, "L123")
const producto3 = new Product("Yerba mate", "Del norte pa", 3000, 22, "Y243")
const producto4 = new Product("Azucar", "La sonrisa", 400, 14, "A433")

const producto1version2 = new Product("Arroz", "Muy rico", 1400, 26, "A123")

const productManager = new ProductManager('./products.json')

// productManager.addProduct(producto1);
// productManager.addProduct(producto2);
// productManager.addProduct(producto3);
// productManager.addProduct(producto4);
productManager.getProducts();
// productManager.getProductById('65fdacd0cbc44538e2a6')
// productManager.updateProduct('65fdacd0cbc44538e2a6', producto1version2)
productManager.deleteProduct('65fdacd0cbc44538e2a6')