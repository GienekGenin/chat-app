const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const moment = require('moment');

const app = express();
const port = 8000;


app.use(express.static(path.normalize(__dirname + "/assets")));
app.use(express.static(path.normalize(__dirname + "/assets/html")));
app.use(express.static(path.normalize(__dirname + "/node_modules")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('port', process.env.PORT || port);

let server = app.listen(port, function () {
    console.log(`App now running on port ${port}`);
});

const io = require('socket.io')(server);

let allClients = [];
let messages = [];
let users = [];
let typingUsers = [];

io.on('connection', function (socket) {
    console.log('New connection');
    allClients.push({'id': socket.id, 'user': undefined});
    socket.on('disconnect', function () {
        let stop = false;
        let object;
        for (let i = 0; i < allClients.length; i++) {
            if (allClients[i].id === socket.id) {
                if (allClients[i].user) {
                    stop = true;
                    object = allClients[i].user;
                    allClients[i].user.created = false;
                    allClients[i].user.exit = moment().format("HH:mm:ss");
                    io.emit('exit', allClients[i].user);
                }
                allClients.splice(i, 1);
            }
        }
        if (stop) {
            for (let i = 0; i < users.length; i++) {
                if (users[i].name === object.name) {
                    users[i].exit = moment().format("HH:mm:ss");
                    users[i].created = false;
                }

            }
        }
    });

    socket.on('chat_message', function (msg) {
        if (messages.length >= 100) {
            messages.shift();
        }
        messages.push(msg);
        io.emit('chat_message', msg);
    });

    socket.on('new_connection', function (user) {
        console.log(user, 'connected');
        for(let i =0;i<users.length;i++){
            if(users[i].name === user.name){
                users[i] = user;
            }
        }
        for (let i = 0; i < allClients.length; i++) {
            if (allClients[i].id === socket.id) {
                allClients[i].user = user;
            }
        }
        io.emit('new_connection', user);
        console.log('clients con: ', allClients);
    });

    socket.on('new_user', function (user) {
        users.push(user);
        for (let i = 0; i < allClients.length; i++) {
            if (allClients[i].id === socket.id) {
                allClients[i].user = user;
            }
        }
        io.emit('new_user', user);
        console.log('clients con: ', allClients);
    });

    // typing and stop typing working gut
    socket.on('typing', function (user) {
        let counter = 0;
        for (let i = 0; i < typingUsers.length; i++) {
            if (typingUsers[i] === user) {
                counter++;
            }
        }
        if (counter === 0) {
            typingUsers.push(user);
        }
        io.emit('typing', typingUsers);
    });
    socket.on('stop_typing', function (user) {
        for (let i = 0; i < typingUsers.length; i++) {
            if (typingUsers[i] === user) {
                typingUsers.splice(i, 1);
            }
        }
        io.emit('stop_typing', typingUsers);
    });

    socket.emit('chat_history', messages, users, typingUsers);
});