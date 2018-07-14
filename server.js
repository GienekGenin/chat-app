const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const moment = require('moment');

const app = express();
let server = require('http').Server(app);
const port = 8000;

app.use(express.static(path.normalize(__dirname + "/assets/html")));
app.use(express.static(path.normalize(__dirname + "/assets/scripts")));
app.use(express.static(path.normalize(__dirname + "/assets/styles")));
app.use(express.static(path.normalize(__dirname + "/node_modules")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('port', process.env.PORT || port);

let users = [];
let messages = [];

app.get('/users', function (req,res) {
    res.json(users);
});

app.get('/messages', function (req,res) {
    res.json(messages);
    console.log(messages);
});

app.post('/users', function (req,res) {
    users.push(req.body);
});

app.post('/messages', function (req,res) {
    messages.push(req.body);
    console.log(messages);
});

server = app.listen(port, function () {
    console.log(`App now running on port ${port}`);
});
