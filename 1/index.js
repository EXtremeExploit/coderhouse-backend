import { ProductManager } from './ProductManager.js';

const pm = new ProductManager();

pm.addProduct({
    title: 'osu!support',
    description: 'Subscripcion de osu! support por 1 mes',
    price: 4,
    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb5K3x0T5RlfV30BSBh4Y7I4cwQ5bqjP04kaxOwl6eWw&s',
    stock: 10000
});


pm.addProduct({
    title: 'osu!support',
    description: 'Subscripcion de osu! support por 12 meses',
    price: 24,
    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb5K3x0T5RlfV30BSBh4Y7I4cwQ5bqjP04kaxOwl6eWw&s',
    stock: 5000
});


pm.addProduct({
    title: 'osu!support',
    description: 'Subscripcion de osu! support por 24 meses',
    price: 52,
    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb5K3x0T5RlfV30BSBh4Y7I4cwQ5bqjP04kaxOwl6eWw&s',
    stock: 100
});

const productosTotales = pm.getProducts();

console.log(productosTotales);

const primerProducto = pm.getProducById(productosTotales[0].code);

console.log(primerProducto)

