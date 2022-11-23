const response = require("./../response");
const knex = require('../db/db');

exports.users = (req, res) => {

    switch (true) {
        case (Object.keys(req.query).length === 1 && req.query.sort === "asc"):
            knex.from('users')
                .select("*")
                .orderBy('date', 'asc')
                .then((rows) => response.status(200, rows, res))
                .catch((err) => response.status(404, err, res));
            break;

        case (typeof req.query.from === "string" && typeof req.query.to === "string"):
            knex.from('users')
                .select("*")
                .whereBetween('date', [new Date(req.query.from).toUTCString(), new Date(req.query.to).toUTCString()])
                .orderBy('date', req.query.sort ? req.query.sort : "desc")
                .then((rows) => response.status(200, rows, res))
                .catch((err) => response.status(404, err, res));
            break;

        default:
            knex.from('users')
                .select("*")
                .orderBy('date', 'desc')
                .then((rows) => response.status(200, rows, res))
                .catch((err) => response.status(404, err, res));
            break;

    }
}

exports.add = (req, res) => {

    knex("users")
        .where({ nick_name: req.body.nick_name })
        .then((user) => {

            if (!req.body.nick_name || !req.body.password || !req.body.department) {
                response.status(404, "nick_name name password department are required", res)
            }

            if (!(Array.isArray(user) && user.length > 0)) {
                knex("users").insert(
                    {
                        nick_name: req.body.nick_name,
                        name: req.body.name,
                        second_name: req.body.second_name,
                        role: req.body.role ? req.body.role : "user",
                        password: new Buffer.from(req.body.password, 'ascii').toString('base64'),
                        department: req.body.department,
                        work_position: req.body.work_position ? req.body.work_position : "empty",
                        date: new Date().toUTCString()
                    }).then(() => {
                        response.status(200, `added new user ${req.body.nick_name}`, res);
                    }).catch((err) => response.status(200, `Please fill fields: name, second_name, nick_name, password ${err}`, res));
            } else {
                response.status(409, `user alredy exists with nickname: ${req.body.nick_name}`, res);
            }

        })
        .catch(err => response.status(404, `User not added, end with: ${err}`, res));
}

exports.update = (req, res) => {

    if (!req.body.nick_name) {
        response.status(404, "nick_name is required", res)
    }

    knex('users')
        .where({ nick_name: req.body.nick_name })
        .update(req.body)
        .then(() => {
            response.status(200, `User data updated ${JSON.stringify(req.body)}`, res);
        })
        .catch(err => response.status(404, `User data not updated, end with: ${err}`, res));
}

exports.delete = (req, res) => {

    knex('users')
        .where({ nick_name: req.body.nick_name })
        .delete()
        .then((user) => {
            if (user) {
                response.status(200, `User "${req.body.nick_name}" removed from db`, res);
            } else {
                response.status(401, `User ${req.body.nick_name} not found`, res);
            }
        })
        .catch(err => response.status(404, `User not deleted from db with err: ${err}`, res));
}