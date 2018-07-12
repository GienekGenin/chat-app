const router = require("express").Router();
const userService = require("../../services/user");

router.get("/", (req, res, next) => {
    userService.findAll((err, data) => {
        if (!err) {
            res.data = data;
            res.json(res.data);
        } else {
            res.status(400);
            res.end();
        }
    });
});

router.get("/:id", (req, res, next) => {
    userService.findOne(Number(req.params.id), (err, data) => {
        if (!err) {
            res.data = data;
            res.json(res.data);
        } else {
            res.status(400);
            res.end();
        }
    });
});

router.delete("/:id", (req, res, next) => {
    userService.removeOne(Number(req.params.id), (err, data) => {
        if (!err) {
            res.data = data;
            res.json(res.data);
        } else {
            res.status(400);
            res.end();
        }
    });
});

router.post("/", (req, res, next) => {
    console.log(req.body, 'in post user');
    userService.save(req.body, (err, data) => {
        if (!err) {
            res.json(req.body);
        } else {
            res.status(400);
            res.end();
        }
    });
});

router.put("/:id", (req, res, next) => {
    userService.update(req.body, (err, data) => {
        if (!err) {
            res.data = data;
            res.json(res.data);
        } else {
            res.status(400);
            res.end();
        }
    });
});

module.exports = router;
