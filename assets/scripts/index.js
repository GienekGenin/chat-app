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
    let userHeader = document.getElementById('you');
    userHeader.innerText = user.name;

    button_login.onclick = function () {
        let name = document.getElementById('name');
        let nik = document.getElementById('nik_name');
        if (!name.value || !nik.value) {
            alert('fill the fields');
        } else {
            for (let i = 0; i < existing_users.length; i++) {
                if (existing_users[i].name === name.value && existing_users[i].nik === nik.value) {
                    user.name = name.value;
                    user.nik = nik.value;
                    user.created = moment().format("HH:mm:ss");
                    user.exit = false;
                    input_msg.disabled = false;
                    button_send.disabled = false;
                    userHeader.innerText = user.name + ' (@' + user.nik+')';
                    let popup = document.getElementById('popup_default');
                    popup.setAttribute('style', 'display:none');
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
            userHeader.innerText = user.name + ' @' + user.nik;
            let popup = document.getElementById('popup_default');
            popup.setAttribute('style', 'display:none');
            socket.emit('new_user', user);
        }
    };

    button_send.onclick = function () {
        let msg = document.getElementById('msg');
        let data = {
            'name': user.name,
            'nik': user.nik,
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
            socket.emit('stop_typing', `${user.name} (@${user.nik})`);
            typing_status = true;
        }
    };

    input_msg.onkeydown = function (e) {
        if (e.key === "Backspace") {
            socket.emit('stop_typing', `${user.name} (@${user.nik})`);
            typing_status = true;
        } else {
            if (typing_status === true) {
                socket.emit('typing', `${user.name} (@${user.nik})`);
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
        let status = document.getElementById(`${_user.name + _user.nik}`);
        let secondsLeft = -moment(_user.created, 'HH:mm:ss').diff(moment(), 'seconds');
        let user_box = document.getElementsByClassName('user_box');
        for (let i = 0; i < user_box.length; i++) {
            if (user_box[i].firstChild.innerText === _user.name + ` (@${_user.nik})`) {
                if (secondsLeft < 60) {
                    console.log('new_connection < 60');
                    user_box[i].setAttribute('class', 'user_box fresh');
                    status.innerText = 'just appeared';
                }
                setTimeout(function () {
                    console.log('new_connection > 60');
                    user_box[i].setAttribute('class', 'user_box online');
                    status.innerText = 'online';
                }, 60000 - secondsLeft * 1000);
            }
        }
    });

    socket.on('exit', function (_user) {
        let status = document.getElementById(`${_user.name + _user.nik}`);
        let typing_boxes = document.getElementsByClassName('type_box');
        let type_container = document.getElementById('typing');
        for(let i =0;i<typing_boxes.length;i++){
            if(typing_boxes[i].firstChild.id === 'typing_user_'+`${_user.name} (@${_user.nik})`){
                type_container.removeChild(typing_boxes[i]);
            }
        }
        createMsg({'name':_user.name,'nik':_user.nik,'time':_user.exit,'text':'Just left'});
        let secondsLeft = -moment(_user.exit, 'HH:mm:ss').diff(moment(), 'seconds');
        let user_box = document.getElementsByClassName('user_box');
        for (let i = 0; i < user_box.length; i++) {
            if (user_box[i].firstChild.innerText === _user.name + ` (@${_user.nik})`) {
                if (secondsLeft < 60) {
                    console.log('exit < 60');
                    status.innerText = 'just left';
                    user_box[i].setAttribute('class', 'user_box just_leave');
                }
                setTimeout(function () {
                    console.log('exit > 60');
                    user_box[i].setAttribute('class', 'user_box offline');
                    status.innerText = 'offline';
                }, 60000 - secondsLeft * 1000);
            }
        }
    });

    function createUser(_user) {
        let user_box = document.createElement('div');
        user_box.setAttribute('class', 'user_box');
        if (_user.created) {
            let secondsLeft = -moment(_user.created, 'HH:mm:ss').diff(moment(), 'seconds');
            if (secondsLeft < 60) {
                console.log('new_connection < 60');
                user_box.setAttribute('class', 'user_box fresh');
            }
            setTimeout(function () {
                console.log('new_connection > 60');
                user_box.setAttribute('class', 'user_box online');
            }, 60000 - secondsLeft * 1000);
        }
        if (_user.exit) {
            let secondsLeft = -moment(_user.exit, 'HH:mm:ss').diff(moment(), 'seconds');
            console.log(secondsLeft);
            if (secondsLeft < 60) {
                console.log('exit < 60');
                user_box.setAttribute('class', 'user_box just_leave');
            }
            setTimeout(function () {
                console.log('exit > 60');
                user_box.setAttribute('class', 'user_box offline');
            }, 60000 - secondsLeft * 1000);
        }
        let name = document.createElement('span');
        let status = document.createElement('span');
        status.setAttribute('id',`${_user.name + _user.nik}`);
        let nameText = document.createTextNode(_user.name+` (@${_user.nik})`);
        let statusText = document.createTextNode('online');
        name.appendChild(nameText);
        status.appendChild(statusText);
        user_box.appendChild(name);
        user_box.appendChild(status);
        users.append(user_box);
    }

    function createMsg(_msg) {
        let parsedText = JSON.stringify(_msg.text);
        let msg_box = document.createElement('div');
        msg_box.setAttribute('class', 'msg_box');
        let name = document.createElement('span');
        name.setAttribute('class', 'name');
        let time = document.createElement('span');
        time.setAttribute('class', 'time');
        let msg = document.createElement('span');
        if (parsedText.search('@' + user.nik) > 0) {
            msg.setAttribute('class', 'mentioned');
        }
        let nameText = document.createTextNode(_msg.name + ` (@${_msg.nik})`);
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
            newTypo.setAttribute('class', 'type_box');
            let name = document.createElement('span');
            name.setAttribute('id', 'typing_user_'+_users[i]);
            let nameText = document.createTextNode(_users[i] + ' is typing');
            name.appendChild(nameText);
            newTypo.appendChild(name);
            typingUsers.appendChild(newTypo);
        }
    }

    function removeTypos() {
        if (typingUsers) {
            while (typingUsers.firstChild) {
                typingUsers.removeChild(typingUsers.firstChild);
            }
        }
    }
})();