(function () {
    let button_login = document.getElementById('save_user');
    let button_send = document.getElementById('send');
    let messages = document.getElementById('messages');
    let users = document.getElementById('users');
    let input_msg = document.getElementById('msg');

    input_msg.value = "";

    let user = {
        'name': 'Pick user name',
        'nik': 'User nik'
    };
    let existing_users = [];
    let existing_messages = [];
    let userHeader = document.getElementById('you');
    userHeader.innerText = user.name;

    let ajaxReq = function (options) {
        let url = options.url || '/';
        let method = options.method || 'GET';
        let callback = options.callback || function () {
        };
        let data = options.data || {};
        let xmlHttp = new XMLHttpRequest();

        xmlHttp.open(method, url, true);
        xmlHttp.setRequestHeader('Content-Type', 'application/json');
        xmlHttp.send(JSON.stringify(data));

        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.status == 200 && xmlHttp.readyState === 4) {
                callback(xmlHttp.responseText);
            }
        }
    };

    let getMessages = function () {
        ajaxReq({
            url: '/messages',
            method: 'GET',
            callback: function (msgs) {
                msgs = JSON.parse(msgs);
                removeMsgs();
                createMsg(msgs);
            }
        })
    };

    let getUsers = function () {
        ajaxReq({
            url: '/users',
            method: 'GET',
            callback: function (users) {
                users = JSON.parse(users);
                existing_users = users;
                removeUsers();
                createUsers(users);
            }
        })
    };

    getUsers();
    getMessages();

    setInterval(function () {
        getUsers();
        getMessages();
    }, 5000);

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
                    input_msg.disabled = false;
                    button_send.disabled = false;
                    userHeader.innerText = `${user.name} (@${user.nik})`;
                    let popup = document.getElementById('popup_default');
                    popup.setAttribute('style', 'display:none');
                    return;
                }
            }
            existing_users.push(user);
            user.name = name.value;
            user.nik = nik.value;
            input_msg.disabled = false;
            button_send.disabled = false;
            userHeader.innerText = `${user.name} (@${user.nik})`;
            let popup = document.getElementById('popup_default');
            popup.setAttribute('style', 'display:none');
            ajaxReq({
                method: 'POST',
                url: '/users',
                data: user
            });
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
            typing_status = true;
            ajaxReq({
                method: 'POST',
                url: '/messages',
                data: data
            });
        }
    };

    function removeUsers() {
        while (users.firstChild) {
            users.removeChild(users.firstChild);
        }
    }

    function removeMsgs() {
        while (messages.firstChild) {
            messages.removeChild(messages.firstChild);
        }
    }

    function createUsers(_users) {
        for (let i = 0; i < _users.length; i++) {
            let user_box = document.createElement('div');
            user_box.setAttribute('class', 'user_box');
            let name = document.createElement('span');
            let nik = document.createElement('span');
            let nameText = document.createTextNode(_users[i].name);
            let nikText = document.createTextNode(` (@${_users[i].nik})`);
            name.appendChild(nameText);
            nik.appendChild(nikText);
            user_box.appendChild(name);
            user_box.appendChild(nik);
            users.append(user_box);
        }
    }

    function createMsg(_msgs) {
        for (let i = 0; i < _msgs.length; i++) {
            let parsedText = JSON.stringify(_msgs[i].text);
            let msg_box = document.createElement('div');
            msg_box.setAttribute('class', 'msg_box');
            let name = document.createElement('span');
            name.setAttribute('class', 'name');
            let time = document.createElement('span');
            time.setAttribute('class', 'time');
            let msg = document.createElement('span');
            if(parsedText.search('@'+user.nik) > 0){
                msg.setAttribute('class', 'mentioned');
            }
            let nameText = document.createTextNode(`${_msgs[i].name} (@${_msgs[i].nik})`);
            let timeText = document.createTextNode(_msgs[i].time);
            let msgText = document.createTextNode(_msgs[i].text);
            name.appendChild(nameText);
            time.appendChild(timeText);
            msg.appendChild(msgText);
            msg_box.appendChild(name);
            msg_box.appendChild(time);
            msg_box.appendChild(msg);
            messages.appendChild(msg_box);
        }
    }

})();
