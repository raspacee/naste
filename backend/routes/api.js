const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const moment = require('moment');

const db = require('../db');
const validatePaste = require('../utils/validatePaste.js');

const MINUTES_IN_A_WEEK = 10080;
const LATEST_PASTES_LIMIT = 15;
const SERVER_ERR = { 'Err': 'Something went wrong try again' };
const REQUEST_ERR = { 'Err': 'Something is wrong with your request' };
const AUTH_ERR = { 'Err': 'Password required' };

// GET: get latest pastes
router.get('/pastes/latest', function(req, res, next) {
    let text = `
    SELECT id, title, body, created_date, syntax_hl, views FROM pastes
    ORDER BY created_date DESC
    LIMIT $1;
    `;
    db.query(text, [LATEST_PASTES_LIMIT], (err, result) => {
        if (err) {
            return res.status(500).send({ 'Err': 'Error retrieving pastes' });
        } else {
            return res.status(200).send(result.rows);
        }
    });
});

// GET: get a paste
router.get('/pastes/:pasteId', async function(req, res, next) {
    let res_code, res_obj;

    if (req.params.pasteId != undefined) {
        try {
            let text = `
            SELECT id, title, body, created_date, syntax_hl, lock_passwd, views FROM pastes
            WHERE pastes.id = $1;
            `;
            let { rows } = await db.query(text, [req.params.pasteId]);
            if (rows[0].lock_passwd == null) {
                res_code = 200;
                res_obj = rows;
            } else {
                res_code = 403;
                res_obj = AUTH_ERR;
            }
        } catch(err) {
            res_code = 400;
            res_obj = REQUEST_ERR;
        }
    }

    return res.status(res_code || 500).send(res_obj);
});

// POST: to view  locked paste
router.post('/paste/locked', async function(req, res) {
    let res_code, res_obj;
    if (req.body.passwd != undefined) {
        let text = `
        SELECT title, body, created_date, syntax_hl, views, passwd FROM pastes
        WHERE pastes.id = $1;
        `;
        try {
            let { rows }  = await db.query(text, [req.body.passwd]);

            if (rows[0].passwd == req.body.passwd) {
                res_code = 200;
                res_obj = rows[0];
            } else {
                res_code = 400;
                res_obj = CLIENT_ERR;
            }
        } catch(err) {
            res_code = 500;
            res_obj = SERVER_ERR;
        }
    } else {
        res_code = 400;
        res_obj = CLIENT_ERR;
    }

    return res.status(res_code || 500).send(res_obj);
})

// POST: create a paste or bundle of pastes
/* IMPORTANT:
    - Content-Type: application/json should be attached to the request
    - The request body must be inside a array. Route accepts [{}] not {}
    - Send [{}, {}] for creating bundle of pastes
*/
router.post('/pastes', async function(req, res, next) {
    let res_code, res_obj;

    let create_bundle = false;
    let bundle_id = null;
    if (req.body.length > 1) {
        create_bundle = true;
        bundle_id = crypto.randomUUID();

        let text = `
        INSERT INTO bundles(id, title)
        VALUES ($1, $2);
        `;

        try {
            const db_res = await db.query(text, [bundle_id, 'temp title']);
        } catch (err) {
            res_code = 500;
            res_obj = { 'Err': 'Error creating the bundle' };
        }

    } else if (req.body.length == undefined) {
        res_code = 400;
        res_obj = { 'Err': 'Something is wrong with your request body' };
    }

    for (let i = 0; i < req.body.length; i++) {
        let data = req.body[i];

        if (validatePaste(data)) {

            let uuid = crypto.randomUUID();
            let timestamp = new Date();
            let title, body, expire_t, passwd, delete_on_views, syntax;

            try {
                title = data.title;
                body = data.body;
                syntax = data.syntax || 'NONE';

                expire_t = data.expire_t || null;
                if (expire_t == 0 || expire_t === null) {
                    expire_t = null;
                } else {
                    if (expire_t < 0 || expire_t > MINUTES_IN_A_WEEK) {
                        res_code = 400;
                        res_obj = { 'Err': 'Expire_t is invalid' };
                    } else {
                        expire_t = moment(timestamp).add(expire_t, 'm').toDate();
                    }
                }

                passwd = data.passwd || null;
                if (passwd == '')
                    passwd = null;

                delete_on_views = data.delete_on_views || null;
                if (delete_on_views === 0)
                    delete_on_views = null;
            } catch (err) {
                console.log(err);
            }

            let text = `
            INSERT INTO pastes(id, title, body, created_date, expire_date, lock_passwd, syntax_hl, views, delete_on_views, bundle_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
            `;

            try {
                await db.query(text, [uuid, title, body, timestamp, expire_t, passwd, syntax.toUpperCase(), 0, delete_on_views, bundle_id]);

                if (expire_t !== null) {
                    let text = `
                    INSERT INTO jobs(id, created_date, finished)
                    VALUES ($1, $2, $3);
                    `;

                    try {
                        await db.query(text, [uuid, timestamp, false]);
                    } catch (err) {
                        console.log(err);
                    }
                }
                res_code = 200;
                res_obj = { 'Id': uuid };
            } catch (err) {
                res_code = 500;
                res_obj = { 'Err': 'Error creating the paste' };
            }
        } else {
            res_code = 400;
            res_obj = { 'Err': 'Something is wrong with your request body' };
        }
    }

    return res.status(res_code || 500).send(res_obj);
});

// FOR BUNDLES
// GET: get a bundle
router.get('/bundles/:bundleId', async function(req, res, next) {
    let res_code, res_obj;
    const bundleId = req.params.bundleId;

    try {
        let text = `
        SELECT id, title, body, created_date, syntax_hl, views FROM pastes
        WHERE bundle_id = $1;
        `;

        let { rows } = await db.query(text, [bundleId]);

        res_code = 200;
        res_obj = rows;
    } catch (err) {
       res_code = 500;
       res_obj = SERVER_ERR;
    }

    return res.status(res_code).send(res_obj);
});

module.exports = router;
