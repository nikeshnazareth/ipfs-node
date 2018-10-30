'use strict';

/**
 * A route to add records to the IPFS node
 */

const express = require('express');
const fs = require('fs');
const request = require('request');
const router = express.Router();
const wrapper = require('../response-wrapper');

const dataDir = '/home/ec2-user/tmp';

router.post('/', (req, res, next) => {
    if (!req.body.record)
        return next({status: 400, message: 'New IPFS record must be specified'});

    const filename = `${dataDir}/${Date.now()}.json`;
    fs.writeFile(filename, JSON.stringify(req.body.record), 'utf-8', (err) => {
        if (err)
            return next({status: 500, message: 'Unable to save the record'});

        const options = {
            url: 'http://127.0.0.1:5001/api/v0/add',
            formData: {'path': fs.createReadStream(filename)}
        };

        request.post(options, (error, response, added) => {
            if (error)
                return next({status: 500, message: 'Unable to add the record to the local IPFS node'});

            // delete the file
            fs.unlink(filename);

            const hash = JSON.parse(added)['Hash'];
            res.json(wrapper.wrap(hash));
       });
    });
});

module.exports = router;
