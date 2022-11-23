const cookie = require("cookie");
const response = require("./../response");
const knex = require('../db/db');
const jwt = require('jsonwebtoken');
const jwtKey = require("../db/knexfile").development.jwt;
const blackListJwt = require("../middleware/blackListJwt");

exports.login = (req, res) => {
    knex('users')
        .select('id', 'role', 'nick_name', 'password')
        .where({ nick_name: req.body.nick_name })
        .then(rows => {
            if (Array.isArray(rows) && rows.length > 0) {
                // get user data from DB
                const { role, id, nick_name, password } = JSON.parse(JSON.stringify(...rows));
                // encode password from DB
                const encodedPass = Buffer.from(password, 'base64').toString('ascii');

                if (req.body.password === encodedPass) {
                    // create jwt token
                    const token = jwt.sign({
                        role,
                        nick_name,
                        id
                    }, jwtKey, { expiresIn: 60 * 15 })

                    //create refresh token
                    const refreshToken = jwt.sign({
                        role,
                        nick_name,
                        id
                    }, jwtKey, { expiresIn: 60 * 60 * 24 })

                    res.setHeader(
                        "Set-Cookie",
                        cookie.serialize("refreshToken", refreshToken, {
                            httpOnly: true,
                            maxAge: 60 * 60 * 24
                        })
                    );

                    response.status(200, { token: `Bearer ${token}` }, res);
                } else {
                    response.status(401, "Password is incorrect", res);
                }

            } else {
                response.status(401, `User ${req.body.nick_name} not found`, res);
            }
        })
        .catch(err => response.status(404, `Bad request: ${err}`, res));
}

exports.logout = (req, res) => {

    try {
        blackListJwt.add(req.headers.authorization);
        blackListJwt.add(cookie.parse(req.headers.cookie).refreshToken);
        response.status(200, `logout success`, res);
    } catch (err) {
        response.status(401, `logout failed ${err}`, res);
    }
}

exports.refresh = (req, res) => {

    try {
        const encoded = jwt.verify(cookie.parse(req.headers.cookie).refreshToken, jwtKey)
        const token = jwt.sign({
            role: encoded.role,
            nick_name: encoded.nick_name,
            id: encoded.id
        }, jwtKey, { expiresIn: 60 * 15 });

        response.status(200, { token: `Bearer ${token}` }, res);
    } catch (err) {
        response.status(401, err, res);
    }
}