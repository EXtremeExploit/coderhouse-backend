import productModel from '../models/products.js';

/**
 * 
 * @param {number} limit 
 * @param {number} page 
 * @param {*} query 
 * @param {string} sort 
 * @returns 
 */
export async function getProducts(limit, page, query, sort) {
    const products = await productModel.paginate(query, { limit, page, sort: { price: sort } });
    return products;
}

export async function getProductById(id) {
    const product = await productModel.findById(id);
    return product;
}

export async function createProduct(product) {
    const result = await productModel.create(product);
    return result;
}

export async function updateProductById(pid, product) {
    const result = await productModel.findByIdAndUpdate(pid, product);
    return result;
}

export async function deleteProduct(id){
    const result = await productModel.findByIdAndDelete(pid);
    return result;
}
