import express from 'express';
import { engine } from 'express-handlebars';
import mongoose from 'mongoose';
import { Server } from 'socket.io'

import apiRouter from './routes/api.js';
import productModel from './models/products.js';
import messageModel from './models/messages.js';

const app = express();
const PORT = process.env.PORT ?? 8080;
const DB_URL = process.env.DB_URL ?? "db url here";

mongoose.connect(DB_URL).then(() => console.log('DB Connected')).catch((e) => console.log(e));

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
    // Realtime Products
    socket.on('pullProducts', async (info) => {
        socket.emit('products', await productModel.find().lean());
    });

    // Mensajes
    socket.on('mensaje', async (msg) => {
        try {
            await messageModel.create(msg);
            const mensajes = await messageModel.find().lean();
            io.emit('mensajeLogs', mensajes);
        } catch (e) {
            io.emit('mensajeLogs', e);
        }
    })
});

app.get('/', async (req, res) => {
    const prods = await productModel.find().lean();

    res.render('templates/index', {
        mostrarProductos: true,
        productos: prods,
        js: 'empty',
    })
});

app.get('/chat', async (req, res) => {
    res.render("templates/chat", {
        js: 'chat',
    });
})


app.get('/realTimeProducts', async (req, res) => {
    res.render('templates/realTimeProducts', {
        js: 'realTimeProducts'
    });
});