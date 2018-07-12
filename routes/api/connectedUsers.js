const router = require("express").Router();
const messageService = require("../../services/message");
const userService = require("../../services/user");

router.get("/", (req, res, next) => {
    res.json('connected route');
});

router.get("/:id", (req, res, next) => {
    messageService.connectedUsers(Number(req.params.id), (err, data) => {
        if (!err) {
            let usersId = [];
            for (let i = 0; i < data.length; i++) {
                usersId.push(data[i].senderId);
            }
            let uniqueUsersId = usersId.filter(function(item, i, arr){ return arr.indexOf(item) === i; });
            userService.findAllWithIds(uniqueUsersId, (err, data) => {
                if (!err) {
                    res.data = data;
                    res.json(res.data);
                } else {
                    res.status(400);
                    res.end();
                }
            });
            // res.data = data;
            // res.json(res.data);
        } else {
            res.status(400);
            res.end();
        }
    });
});


module.exports = router;
