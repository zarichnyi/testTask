const response = require("./../response");
const knex = require('../db/db');
const socketPort = require("../db/knexfile").development.socketPort;
const socketHost = require("../db/knexfile").development.connection.host;
const io = require('socket.io-client');
const socket = io.connect(`http://${socketHost}:${socketPort}/`, { reconnect: true });

exports.topics = (req, res) => {

    switch (true) {
        case (Object.keys(req.query).length === 1 && req.query.sort === "asc"):
            knex.from('topics')
                .select("*")
                .orderBy('date', 'asc')
                .then((rows) => response.status(200, rows, res))
                .catch((err) => response.status(404, err, res));
            break;

        case (typeof req.query.from === "string" && typeof req.query.to === "string"):
            knex.from('topics')
                .select("*")
                .whereBetween('date', [new Date(req.query.from).toUTCString(), new Date(req.query.to).toUTCString()])
                .orderBy('date', req.query.sort ? req.query.sort : "desc")
                .then((rows) => response.status(200, rows, res))
                .catch((err) => response.status(404, err, res));
            break;

        default:
            knex.from('topics')
                .select("*")
                .orderBy('date', 'desc')
                .then((rows) => response.status(200, rows, res))
                .catch((err) => response.status(404, err, res));
            break;

    }
}

exports.add = (req, res) => {

    if (!req.body.title || !req.body.body) {
        response.status(404, "title body are required", res)
    }

    knex("topics")
        .insert(
            {
                title: req.body.title,
                body: req.body.body,
                summary: req.body.summary,
                date: new Date().toUTCString(),
                user_id: req.body.user_id,
            })
        .then(() => {
            response.status(200, `added new topic ${req.body.title}`, res);
            socket.emit("message", `ADDED NEW TOPIC "${req.body.title}" with summary: ${req.body.summary}`);

        })
        .catch(err => response.status(404, err, res));
}

exports.update = (req, res) => {

    knex('topics')
        .where({ title: req.body.title })
        .update(req.body)
        .then(() => {
            response.status(200, `Topic updated ${req.body}`, res)
        })
        .catch(err => response.status(404, err, res));
}

exports.delete = (req, res) => {

    knex('topics')
        .where({ title: req.body.title })
        .delete()
        .then(() => {
            response.status(200, `Topic ${req.body.title} is removed from db`, res)
        })
        .catch(err => response.status(404, err, res));
}