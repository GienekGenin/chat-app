(function () {
    let button_save = document.getElementById('save_user');
    let button_send = document.getElementById('send');
    let messages = document.getElementById('messages');
    let users = document.getElementById('users');

    let socket = io.connect();

    let userName = 'User name';
    let userNik = 'User nik';
    let userHeader = document.getElementById('userName');
    userHeader.innerText = userName;

    button_save.onclick = function () {
        let name = document.getElementById('name');
        let nik = document.getElementById('nik_name');
        if (!name.value || !nik.value) {
            alert('fill the fields');
        } else {
            userName = name.value;
            userNik = nik.value;
            userHeader.innerText = userName;
        }
    };

    button_send.onclick = function () {
        let msg = document.getElementById('msg');
        let data = {
            'name': userName,
            'msg': String
        };
        if (!msg.value) {
            alert('type something');
        } else {
            data.msg = msg.value;
            msg.value = "";
        }

        socket.emit('chat_message', data);
    };

    socket.on('chat_history', function (msg) {
        for(let i = 0;i<msg.length;i++){
            let message = document.createElement('span');
            let messageText = document.createTextNode(`${msg[i].name}:${msg[i].msg}`);
            message.appendChild(messageText);
            messages.appendChild(message);
        }
    });

    socket.on('chat_message', function (msg) {
        let message = document.createElement('span');
        let messageText = document.createTextNode(`${msg.name}:${msg.msg}`);
        message.appendChild(messageText);
        messages.appendChild(message);
    })
})();