(function () {
    let button_save = document.getElementById('save_user');
    let button_send = document.getElementById('send');
    let messages = document.getElementById('messages');
    let users = document.getElementById('users');
    let input_msg = document.getElementById('msg');
    let typingUsers = document.getElementById('typing');

    input_msg.value = "";

    let socket = io.connect();

    let user = {
        'name': 'User name',
        'nik': 'User nik'
    };
    let userHeader = document.getElementById('userName');
    userHeader.innerText = user.name;

    button_save.onclick = function () {
        let name = document.getElementById('name');
        let nik = document.getElementById('nik_name');
        if (!name.value || !nik.value) {
            alert('fill the fields');
        } else {
            user.name = name.value;
            user.nik = nik.value;
            input_msg.disabled = false;
            button_send.disabled = false;
            userHeader.innerText = user.name;
            socket.emit('new_user', user);
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
        }
    };

    input_msg.onkeydown = function (e) {
        if(e.key === "Backspace"){
            socket.emit('stop_typing', '@' + user.name);
        } else {
            socket.emit('typing', '@' + user.name);
        }
    };

    socket.on('chat_history', function (msgs, users) {
        for (let i = 0; i < msgs.length; i++) {
            createMsg(msgs[i]);
        }
        for (let i = 0; i < users.length; i++) {
            craeteUser(users[i]);
        }
    });

    socket.on('typing', function (users) {

    });

    socket.on('stop_typing', function (users) {

    });

    /*        for(let i = 0;i<users.length;i++){
            let newTypo = document.createElement('div');
            let name = document.createElement('span');
            name.setAttribute('class', 'typing_user');
            let nameText = document.createTextNode(users[i]);
            name.appendChild(nameText);
            newTypo.appendChild(name);
            typingUsers.appendChild(newTypo);
        }*/

    socket.on('chat_message', function (msg) {
        createMsg(msg);
    });

    socket.on('new_user', function (user) {
        craeteUser(user);
    });

    function craeteUser(_user) {
        let user_box = document.createElement('div');
        user_box.setAttribute('class', 'user_box');
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
})();