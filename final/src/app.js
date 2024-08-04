import config from './config.js'
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
import { generateProduct } from './controllers/mock.js';

import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { addLogger } from './utils/logger.js';
import { userModel } from './models/user.js';
import cartModel from './models/cart.js';

export const app = express();
app.use(addLogger);

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentacion API",
            description: "Documentacion para uso de swagger"
        }
    },
    apis: [`./docs/**/*.yaml`]
}

const specs = swaggerJsDoc(swaggerOptions);
app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(specs));


mongoose.connect(config.mongo_url).then(() => console.log('DB Connected')).catch((e) => console.log(e));

app.use(express.json());

app.use(session({
    secret: config.session_secret,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: config.mongo_url,
        ttl: 60 * 60
    }),
}));

app.use(cookieParser(config.cookies_secret));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', apiRouter);

export const server = app.listen(config.port, () => {
    console.log('Listening on port: ' + config.port);
});

const io = new Server(server);

app.use('/public', express.static('src/public'));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', 'src/views');

io.on('connection', (socket) => {
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
});


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

// Mock
app.get('/mockingproducts', async (req, res) => {
    const PRODS_SIZE = 100;
    try {
        let mockProducts = [];

        for (let i = 0; i < PRODS_SIZE; i++) {
            let element = generateProduct();
            mockProducts.push(element);
        }

        res.status(200).send(mockProducts);

    } catch (error) {
        res.status(500).send(`Error al generar ${PRODS_SIZE} productos: ${e}`);
    }
})


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


app.get('/loggerTest', (req, res) => {
    req.logger.fatal('log de fatal');
    req.logger.error('log de error');
    req.logger.warning('log de warning');
    req.logger.info('log de info');
    req.logger.http('log de http');
    req.logger.debug('log de debug');
    res.send('ok');
});

// Admin

app.get('/admin/user/:uid', async (req, res) => {
    const { uid } = req.params;

    if (req.user?.rol == 'Admin') {
        let user = await userModel.findById(uid);
        if (user) {
            res.render('templates/adminUserView', {
                js: 'adminUser',
                userFound: true,
                id: user._id.toHexString(),
                first_name: user.first_name,
                last_name: user.last_name,
                age: user.age,
                email: user.email,
                rol: user.rol,
                last_connection: user.last_connection.toString(),
            });
        } else {
            res.render('templates/adminUserView', {
                js: 'adminUser',
                userFound: false,
                id: '',
                first_name: '',
                last_name: '',
                age: '',
                email: '',
                rol: '',
                last_connection: '',
            });
        }
    } else {
        res.status(403).send('No autorizado');
    }
});

// Productos

app.get('/product/:pid', async (req, res) => {
    const { pid } = req.params;

    let prod = await productModel.findById(pid);

    let prodFound = false;
    let title = '';
    let description = '';
    let stock = '';
    let code = '';
    let price = '';

    if (prod) {
        prodFound = true;
        title = prod.title;
        description = prod.description;
        stock = prod.stock;
        code = prod.code;
        price = prod.price;
    }

    let isLoggedin = false;
    let cid = '';
    if (req.user?.email) {
        isLoggedin = true;
        cid = req.user?.cartId;
    }

    res.render('templates/product', {
        js: 'product',
        prodFound,
        title,
        description,
        stock,
        code,
        price,
        isLoggedin,
        pid,
        cid
    });
});

// cart

app.get('/cart', async (req, res) => {

    let isLoggedin = false;
    let cid = '';
    let productos = [];
    if (req.user?.email) {
        isLoggedin = true;
        cid = req.user?.cartId;
        const cart = await cartModel.findById(cid).lean();
        if (cart) {
            productos = cart.products.map((p) => p.id_prod);
        } else {
            req.logger.warning(`${req.user.email} has no cart`);
        }
    }


    if (!isLoggedin) {
        res.status(403).send('No autorizado');
        return;
    }
    res.render('templates/cart', {
        js: 'cart',
        productos: productos,
        cid: cid
    })
})