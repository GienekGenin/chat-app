const user = require("./user");
const message = require("./message");
const connected = require("./connectedUsers");

module.exports = function (app) {
    app.use("/api/user", user);
    app.use('/api/message', message);
    app.use('/api/connected', connected);
};
