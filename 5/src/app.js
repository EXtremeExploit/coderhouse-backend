import express from 'express';
import { engine } from 'express-handlebars';

import { Server } from 'socket.io'

import apiRouter from './routes/api.js';

import { ProductManager } from './ProductManager.js';
const pm = new ProductManager('src/data/products.json');


const app = express();
const PORT = process.env.PORT ?? 8080;

app.use(express.json());

app.use('/api', apiRouter);

const server = app.listen(PORT, () => {
    console.log('Listening on port: ' + PORT);
});

const io = new Server(server);

app.use('/public', express.static('src/public'))

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', 'src/views')

io.on('connection', (socket) => {
    console.log('cliente conectado');
    socket.on('pullProducts', async (info) => {
        socket.emit('products', await pm.getProducts());
    });
});

app.get('/', async (req, res) => {
    const prods = await pm.getProducts();

    res.render('templates/index', {
        mostrarProductos: true,
        productos: prods,
        js: 'empty',
    })
});


app.get('/realTimeProducts', async (req, res) => {
    res.render('templates/realTimeProducts', {
        js: 'realTimeProducts'
    });
});