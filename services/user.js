const UserRepository = require("../repositories/UserRepository");

module.exports = {
  findAll: callback => {
    UserRepository.getAll((err, data) => {
      callback(null, data);
    });
  },

  findOne: (id, callback) => {
    UserRepository.getById(id, (err, data) => {
      callback(err, data);
    });
  }
};
