const router = require("express").Router();
const messageService = require("../../services/message");

router.get("/", (req, res, next) => {
    messageService.findAll((err, data) => {
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
    messageService.findAllWithId(Number(req.params.id), (err, data) => {
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
    messageService.removeOne(Number(req.params.id), (err, data) => {
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
    messageService.save(req.body, (err, data) => {
        if (!err) {
            res.json(req.body);
        } else {
            res.status(400);
            res.end();
        }
    });
});

router.put("/:senderId", (req, res, next) => {
    messageService.update(req.body, (err, data) => {
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
