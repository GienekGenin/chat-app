const MessageRepository = require("../repositories/MessageRepository");

module.exports = {
    findAll: callback => {
        MessageRepository.getAll((err, data) => {
            callback(null, data);
        });
    },

    findOne: (id, callback) => {
        MessageRepository.getById(id, (err, data) => {
            callback(err, data);
        });
    },

    removeOne: (id, callback) => {
        MessageRepository.removeById(id, (err, data) => {
            callback(err, data);
        });
    },

    save: (obj, callback) => {
        MessageRepository.saveOne(obj, (err, data) => {
            callback(err, data);
        });
    },

    update: (obj, callback) => {
        MessageRepository.update(obj, (err, data) => {
            callback(err, data);
        });
    },

    connectedUsers: (id, callback) => {
        MessageRepository.connectedUsers(id, (err, data) => {
            callback(err, data);
        });
    }


};
