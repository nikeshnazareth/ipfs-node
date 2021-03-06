'use strict';

const express = require('express');
const session = require('express-session');
const compression = require('compression');
const bodyParser = require('body-parser');
const random = require('secure-random');
const FileStreamRotator = require('file-stream-rotator');
const morgan = require('morgan');
const path = require('path');
const swaggerUI = require('swagger-ui-express');

const addIPFS = require('./addIPFS/module');
const api = require('./api/module');

/*** SET UP SESSION ***/

const app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    name: 'sessionID', // use a generic name to prevent app fingerprinting
    secret: random(32).toString(),
    resave: false, // don't save sessions that have not changed
    saveUninitialized: true,
    rolling: true, // a session ID cookie is set on every response (resetting the expiration time)
    cookie: {
        httpOnly: true, // compliant clients will not reveal the cookie to client-side javascript
        secure: true, // only send cookies over https,
        maxAge: 1000 * 60 * 30 // 30 minutes
    },
    // TODO: add a session store (the default Memory Store does not scale and has memory leaks)
}));
app.disable('x-powered-by'); // Don't reveal that we're using Express

/*** LOGGING ***/

const logDirectory = path.join(__dirname, 'log');
const accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: path.join(logDirectory, 'access-%DATE%.log'),
    frequency: 'daily',
    verbose: false
});
app.use(morgan('combined', {stream: accessLogStream}));

/*** CORS ***/
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://www.verifiable-voting.nikeshnazareth.com');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

/*** ROUTES ***/

app.use(express.static('static'));
app.use('/add', addIPFS.route);

/*** API Documentation ***/

app.use('/api', swaggerUI.serve, swaggerUI.setup(api.json));

/*** ERROR HANDLING ***/

app.use((req, res, next) => {
    return next({status: 404, message: 'Resource not found'});
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const msg = err.message || 'Internal Server Error: Unhandled use case';
    res.status(status).send({error: msg});
});

module.exports = app;