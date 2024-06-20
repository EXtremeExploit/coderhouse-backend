import crypto from 'crypto';
import cartModel from '../models/cart.js';
import productModel from '../models/products.js';
import ticketModel from '../models/ticket.js';
import { userModel } from '../models/user.js';

export async function getCart(id) {
    const cart = await cartModel.findOne({ _id: id });
    return cart;
}

export async function deleteCart(id) {
    const msg = await cartModel.findByIdAndUpdate(id, { products: [] });
    return msg;
}

export async function updateCart(id, body) {
    const msg = await cartModel.findByIdAndUpdate(id, { products: body });
    return msg;
}

export async function addProduct(cid, pid, quantity) {
    const cart = await cartModel.findById(cid);

    const i = cart.products.findIndex((p) => p.id_prod == pid);

    if (i != -1) {
        cart.products[i].quantity += (quantity ?? 1);
    } else {
        cart.products.push({ id_prod: pid, quantity: quantity });
    }

    const msg = await cartModel.findByIdAndUpdate(cid, cart);
    return msg;
}

export async function setProduct(cid, pid, quantity) {

    const cart = await cartModel.findById(cid);

    const i = cart.products.findIndex((p) => p.id_prod == pid);

    if (i != -1) {
        cart.products[i].quantity = quantity;
    }

    const msg = await cartModel.findByIdAndUpdate(cid, cart);
    return msg;
}

export async function deleteProduct(cid, pid) {

    const cart = await cartModel.findById(cid);

    const i = cart.products.findIndex((p) => p.id_prod == pid);

    if (i != -1) {
        cart.products.splice(i, 1);
    }

    const msg = await cartModel.findByIdAndUpdate(cid, cart);
    return msg;
}

export async function purchase(cid, email) {
    const cart = await cartModel.findById(cid)
    const prodSinStock = []
    if (cart) {
        cart.products.filter(async (e) => {
            const producto = await productModel.findById(cartProd.id_prod);
            if (producto.stock < cartProd.quantity) {
                prodSinStock.push({ producto, stockCarrito: cartProd.quantity });
                return false;
            }
            return true;
        });
        let amount = 0;
        cart.products.forEach(async (cartProd) => {
            let producto = await productModel.findById(cartProd.id_prod);
            amount += producto.price;
            producto.stock--;
            await productModel.findByIdAndUpdate(producto._id, producto);
        });

        const user = await userModel.findOne({ email: email });
        if (user.rol == 'Premium')
            amount -= amount * 15; // 15% descuento para premium

        cart.products = prodSinStock.map((e) => e.producto);
        await cartModel.findByIdAndUpdate(cid, cart);

        const ticket = await ticketModel.create({
            products: cart.products,
            amount: amount,
            purchase_datetime: Date.now(),
            purchaser: email,
            code: crypto.randomBytes(8).toString('hex')
        });

        if (prodSinStock.length == 0)
            return `Compra realizada con exito. Su ticket es ${ticket.code}`;
        return `Error al comprar los siguientes productos por falta de stock: \n${prodSinStock.map((e) => `${e.producto.title} | Stock en el carrito: ${e.stockCarrito} | Stock disponible: ${e.producto.stock}\n`)}\n El resto de productos han sido comprados.`;

    } else {
        res.status(404).send("Carrito no existe")
    }
}