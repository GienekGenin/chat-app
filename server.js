const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongooseConnection = require("./db/dbconnect").connection;
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
let server = require('http').Server(app);
const port = 8000;

app.use(
  session({
    secret: "sessionsecretsessionsecret",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: mongooseConnection
    })
  })
);

app.use(express.static(path.normalize(__dirname + "/public")));
app.use(express.static(path.normalize(__dirname + "/scripts")));
app.use(express.static(path.normalize(__dirname + "/node_modules")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require("./routes/api/routes")(app);

app.set('port', process.env.PORT || port);

server = app.listen(port, function () {
    console.log(`App now running on port ${port}`);
});

const io = require('socket.io')(server);

io.on('connection', function(socket){
    console.log('New connection');
});