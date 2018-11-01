'use strict';

const app = require('./server');
const https = require('https');
const fs = require('fs');

/*** START THE SERVER ***/

const port = process.env.PORT || 3000;
app.set('port', port);

const options = {
    cert: fs.readFileSync('./sslcert/fullchain.pem'),
    key: fs.readFileSync('./sslcert/privkey.pem')
};

const server = https.createServer(options, app);
server.listen(port);

/*** HANDLE EVENTS ***/

server.on('listening', () => {
    console.log(`Listening on port ${server.address().port}`);
});

server.on('error', error => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    // handle specific listening errors with friendly messages
    switch (error.code) {
        case 'EACCESS':
            console.error(`Port ${port} requires elevated privileges`);
            break;
        case 'EADDRINUSE':
            console.error(`Port ${port} is already in use`);
            break;
        default:
            throw error;
    }
});