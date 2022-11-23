const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwtKey = require("../db/knexfile").development.jwt;
const knex = require("../db/db");

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtKey
}

module.exports = passport => {
    passport.use(
        new JwtStrategy(options, (payload, done) => {
            try {
                knex('users')
                .where({ nick_name: payload.nick_name })
                .select('role', 'nick_name')
                .then(row => {
                    if(Array.isArray(row) && row.length > 0) {
                        done(null, JSON.parse(JSON.stringify(...row)));
                    } else {
                        done(null, false);
                    }
                })
            } catch(err) {
                console.log(`Passport js end with error: ${err}`);
            }
        })
    );
}