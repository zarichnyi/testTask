const passport = require('passport');
const PassportWithRoles = require('passport-with-roles');
const hasRoles = new PassportWithRoles("role");
const indexController = require("./../Controller/indexController");
const usersController = require("./../Controller/UsersController");
const authController = require("./../Controller/authController");
const topicsController = require("./../Controller/TopicsController");
const validateJwtToken = require("../middleware/blackListJwt").validateJwtToken;

module.exports = (app) => {
    
    // init default data
    app.route("/").get(indexController.index);

    // users routes
    app.route("/users").get(
        passport.authenticate("jwt", { session: false }),
        hasRoles.authorize(["admin"]),
        validateJwtToken,
        usersController.users
    );
    app.route("/users/add").post(
        passport.authenticate("jwt", { session: false }),
        hasRoles.authorize(["admin"]),
        validateJwtToken,
        usersController.add
    );
    app.route("/users/update").post(
        passport.authenticate("jwt", { session: false }),
        hasRoles.authorize(["admin"]),
        validateJwtToken,
        usersController.update
    );
    app.route("/users/delete").post(
        passport.authenticate("jwt", { session: false }),
        hasRoles.authorize(["admin"]),
        validateJwtToken,
        usersController.delete
    );

    // topics routes
    app.route("/topics").get(
        passport.authenticate("jwt", { session: false }),
        hasRoles.authorize(["admin", "user"]),
        validateJwtToken,
        topicsController.topics
    );
    app.route("/topics/add").post(
        passport.authenticate("jwt", { session: false }),
        hasRoles.authorize(["admin"]),
        validateJwtToken,
        topicsController.add
    );
    app.route("/topics/update").post(
        passport.authenticate("jwt", { session: false }),
        hasRoles.authorize(["admin"]),
        validateJwtToken,
        topicsController.update
    );
    app.route("/topics/delete").post(
        passport.authenticate("jwt", { session: false }),
        hasRoles.authorize(["admin"]),
        validateJwtToken,
        topicsController.delete
    );

    // auth routes
    app.route("/login").post(
        authController.login
    );
    app.route("/logout").post(
        passport.authenticate("jwt", { session: false }),
        hasRoles.authorize(["admin", "user"]),
        validateJwtToken,
        authController.logout
    );
    app.route("/refresh").post(
        validateJwtToken,
        authController.refresh
    );
}