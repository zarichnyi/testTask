const cookie = require("cookie");
const blacklist = [];

exports.add = (jwt) => {
    blacklist.push(jwt);
};

exports.validateJwtToken = (request, response, next) => {

    if (blacklist.includes(request.headers.authorization)) {
        response.status(401).send("unathorized user");
    } else if (blacklist.includes(cookie.parse(request.headers.cookie).refreshToken)) {
        response.status(401).send("unathorized user");
    } else {
        next();
    }
};