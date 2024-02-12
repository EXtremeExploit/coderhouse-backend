import express from 'express';

import apiRouter from './routes/api.js';

const app = express();
const PORT = process.env.PORT ?? 8080;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('o/');
});

app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log('Listening on port: ' + PORT);
});
