(function () {
    let button_login = document.getElementById('save_user');
    let button_send = document.getElementById('send');
    let messages = document.getElementById('messages');
    let users = document.getElementById('users');
    let input_msg = document.getElementById('msg');
    let typingUsers = document.getElementById('typing');

    input_msg.value = "";

    let user = {
        'name': 'User name',
        'nik': 'User nik'
    };
    let typing_status = true;
    let existing_users = [];
    let userHeader = document.getElementById('userName');
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
          url:'/messages',
          method:'GET',
          callback:function (msg) {
              msg = JSON.parse(msg);
              console.log(msg);
          }
      })
    };

    let getUsers = function () {
        ajaxReq({
            url:'/users',
            method:'GET',
            callback:function (msg) {
                msg = JSON.parse(msg);
                console.log(msg);
            }
        })
    };

    getUsers();
    getMessages();

    setInterval(function () {
        getUsers();
        getMessages();
    },1000);

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
                    input_msg.disabled = false;
                    button_send.disabled = false;
                    userHeader.innerText = user.name;
                    return;
                }
            }
            existing_users.push(user);
            user.name = name.value;
            user.nik = nik.value;
            input_msg.disabled = false;
            button_send.disabled = false;
            userHeader.innerText = user.name;
            let form = document.getElementsByTagName('form');
            let formParent = form[0].parentNode;
            formParent.removeChild(form[0]);
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

    function createUser(_user) {
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
