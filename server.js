const express = require("express");
const app = express();
const expressPort = require("./db/knexfile").development.expressPort;
const socketPort = require("./db/knexfile").development.socketPort;
const bodyParser = require("body-parser");
const passport = require("passport");

const socketIO = require("socket.io").Server;
const io = new socketIO(socketPort);

io.on("connection", (socket) => {
    socket.on("message", (msg) => console.log(msg));
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
require("./middleware/passport")(passport);


const routes = require('./settings/routes');
routes(app);

app.listen(expressPort, () => {
    console.log(`Server is working on port ${expressPort}`)
})