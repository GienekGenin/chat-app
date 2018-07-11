const connection = require("../db/dbconnect");
const Repository = require("./generalRepository");
const Message = require("../models/messages");

function MessageRepository() {
    Repository.prototype.constructor.call(this);
    this.model = Message;
    this.getById = getById;
    this.removeById = removeById;
    this.update = update;
}

MessageRepository.prototype = new Repository();

function getById(id, callback) {
    let model = this.model;
    let query = model.findOne({
        senderId: id
    });
    query.exec(callback);
}

function removeById(id, callback) {
    let model = this.model;
    let query = model.deleteOne({
        senderId: id
    });
    query.exec(callback);
}

function update(obj, callback) {
    let model = this.model;
    let query = model.update({senderId: obj.senderId}, {'receiverId': obj.receiverId, 'message': obj.message});
    query.exec(callback);
}

module.exports = new MessageRepository();
