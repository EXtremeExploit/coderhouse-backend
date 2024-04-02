import express from 'express';
import { engine } from 'express-handlebars';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';

import apiRouter from './routes/api.js';
import productModel from './models/products.js';
import messageModel from './models/messages.js';
import initializePassport from './config/passport/passport.js';
import passport from 'passport';

import {PORT} from './utils/port.js';

const app = express();
const DB_URL = process.env.DB_URL ?? "db url here";

mongoose.connect(DB_URL).then(() => console.log('DB Connected')).catch((e) => console.log(e));

app.use(express.json());

app.use(session({
    secret: 'llaveSecreta',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: DB_URL,
        ttl: 60*60
    }),
}));

app.use(cookieParser('claveSecreta'));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

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
        js: 'index',
        email: req.user?.email,
        rol: req.user?.rol,
        loggedIn: !!req.user?.email
    });
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

app.get('/register', async (req, res) => {
    res.render('templates/register', {
        js: 'register'
    });
});


app.get('/login', async (req, res) => {
    res.render('templates/login', {
        js: 'login'
    });
});


//Session Routes

app.get('/session', (req, res) => {
    if (req.session.counter) {
        req.session.counter++;
        res.send(`Sos el usuario N° ${req.session.counter} en ingresar a la pagina`);
    } else {
        req.session.counter = 1;
        res.send("Sos el primer usuario que ingresa a la pagina");
    }
});
