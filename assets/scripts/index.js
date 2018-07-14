(function () {
    let button_login = document.getElementById('save_user');
    let button_send = document.getElementById('send');
    let messages = document.getElementById('messages');
    let users = document.getElementById('users');
    let input_msg = document.getElementById('msg');
    let typingUsers = document.getElementById('typing');

    input_msg.value = "";

    let socket = io.connect();

    let user = {
        'name': 'User name',
        'nik': 'User nik',
        'status': String,
        'created': String,
        'exit': String
    };
    let typing_status = true;
    let existing_users = [];
    let userHeader = document.getElementById('userName');
    userHeader.innerText = user.name;

    button_login.onclick = function () {
        let name = document.getElementById('name');
        let nik = document.getElementById('nik_name');
        if (!name.value || !nik.value) {
            alert('fill the fields');
        } else {
            for (let i = 0; i < existing_users.length; i++) {
                if (existing_users[i].name === name.value) {
                    user.name = name.value;
                    user.nik = nik.value;
                    user.created = moment().format("HH:mm:ss");
                    user.exit = false;
                    input_msg.disabled = false;
                    button_send.disabled = false;
                    userHeader.innerText = user.name;
                    socket.emit('new_connection', user);
                    return;
                }
            }
            existing_users.push(user);
            user.name = name.value;
            user.nik = nik.value;
            user.created = moment().format("HH:mm:ss");
            user.exit = false;
            input_msg.disabled = false;
            button_send.disabled = false;
            userHeader.innerText = user.name;
            socket.emit('new_user', user);
            let form = document.getElementsByTagName('form');
            let formParent = form[0].parentNode;
            formParent.removeChild(form[0]);
        }
    };

    button_send.onclick = function () {
        let msg = document.getElementById('msg');
        let data = {
            'name': user.name,
            'text': String,
            'time': String
        };
        if (!msg.value) {
            alert('type something');
        } else {
            data.text = msg.value;
            data.time = moment().format("HH:mm:ss");
            msg.value = "";
            socket.emit('chat_message', data);
            socket.emit('stop_typing', '@' + user.name);
            typing_status = true;
        }
    };

    input_msg.onkeydown = function (e) {
        if (e.key === "Backspace") {
            socket.emit('stop_typing', '@' + user.name);
            typing_status = true;
        } else {
            if (typing_status === true) {
                socket.emit('typing', '@' + user.name);
                typing_status = false;
            }
        }
    };

    socket.on('chat_history', function (msgs, users, typing_users) {
        console.log(users);
        existing_users = users;
        for (let i = 0; i < msgs.length; i++) {
            createMsg(msgs[i]);
        }
        for (let i = 0; i < users.length; i++) {
            createUser(users[i]);
        }
        removeTypos();
        createNewTypo(typing_users);
    });

    socket.on('typing', function (_users) {
        removeTypos();
        createNewTypo(_users);
    });

    socket.on('stop_typing', function (_users) {
        removeTypos();
        createNewTypo(_users);
    });

    socket.on('chat_message', function (msg) {
        createMsg(msg);
    });

    socket.on('new_user', function (user) {
        createUser(user);
    });

    socket.on('new_connection', function (_user) {
        let secondsLeft = -moment(_user.created, 'HH:mm:ss').diff(moment(), 'seconds');
        let user_box = document.getElementsByClassName('user_box');
        for (let i = 0; i < user_box.length; i++) {
            if (user_box[i].firstChild.innerText === _user.name) {
                if(secondsLeft < 60){
                    console.log('new_connection < 60');
                    user_box[i].setAttribute('class', 'user_box fresh');
                }
                setTimeout(function () {
                    console.log('new_connection > 60');
                    user_box[i].setAttribute('class', 'user_box online');
                }, 60000 - secondsLeft*1000);
            }
        }
    });

    socket.on('exit', function (_user) {
        let secondsLeft = -moment(_user.exit, 'HH:mm:ss').diff(moment(), 'seconds');
        let user_box = document.getElementsByClassName('user_box');
        for (let i = 0; i < user_box.length; i++) {
            if (user_box[i].firstChild.innerText === _user.name) {
                if(secondsLeft < 60){
                    console.log('exit < 60');
                    user_box[i].setAttribute('class', 'user_box just_leave');
                }
                setTimeout(function () {
                    console.log('exit > 60');
                    user_box[i].setAttribute('class', 'user_box offline');
                }, 60000 - secondsLeft*1000);
            }
        }
    });

    function createUser(_user) {
        let user_box = document.createElement('div');
        user_box.setAttribute('class', 'user_box');
        if(_user.created){
            let secondsLeft = -moment(_user.created, 'HH:mm:ss').diff(moment(), 'seconds');
            if(secondsLeft < 60){
                console.log('new_connection < 60');
                user_box.setAttribute('class', 'user_box fresh');
            }
            setTimeout(function () {
                console.log('new_connection > 60');
                user_box.setAttribute('class', 'user_box online');
            }, 60000 - secondsLeft*1000);
        }
        if(_user.exit){
            let secondsLeft = -moment(_user.exit, 'HH:mm:ss').diff(moment(), 'seconds');
            console.log(secondsLeft);
            if(secondsLeft < 60){
                console.log('exit < 60');
                user_box.setAttribute('class', 'user_box just_leave');
            }
            setTimeout(function () {
                console.log('exit > 60');
                user_box.setAttribute('class', 'user_box offline');
            }, 60000 - secondsLeft*1000);
        }
        let name = document.createElement('span');
        let nik = document.createElement('span');
        let nameText = document.createTextNode(_user.name);
        let nikText = document.createTextNode(_user.nik);
        name.appendChild(nameText);
        nik.appendChild(nikText);
        user_box.appendChild(name);
        user_box.appendChild(nik);
        users.append(user_box);
    }

    function createMsg(_msg) {
        let msg_box = document.createElement('div');
        msg_box.setAttribute('class', 'msg_box');
        let name = document.createElement('span');
        let time = document.createElement('span');
        let msg = document.createElement('span');
        let nameText = document.createTextNode(_msg.name);
        let timeText = document.createTextNode(_msg.time);
        let msgText = document.createTextNode(_msg.text);
        name.appendChild(nameText);
        time.appendChild(timeText);
        msg.appendChild(msgText);
        msg_box.appendChild(name);
        msg_box.appendChild(time);
        msg_box.appendChild(msg);
        messages.appendChild(msg_box);
    }

    function createNewTypo(_users) {
        for (let i = 0; i < _users.length; i++) {
            let newTypo = document.createElement('div');
            let name = document.createElement('span');
            name.setAttribute('class', 'typing_user');
            let nameText = document.createTextNode(_users[i] + ' is typing');
            name.appendChild(nameText);
            newTypo.appendChild(name);
            typingUsers.appendChild(newTypo);
        }
    }

    function removeTypos() {
        let typoChildren = [];
        for (let i = 0; i < typingUsers.childNodes.length; i++) {
            typoChildren.push(typingUsers.childNodes[i]);
        }
        for (let i = 0; i < typoChildren.length; i++) {
            typingUsers.removeChild(typoChildren[i]);
        }
    }
})();

/*
    socket.on('user_status_online',function (user) {
        let user_box = document.getElementsByClassName('user_box');
        for (let i = 0; i < user_box.length; i++) {
            if (user_box[i].firstChild.innerText === user.name) {
                user_box[i].setAttribute('class', 'user_box online');
            }
        }
    });
* */