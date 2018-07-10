function Repository() {}

Repository.prototype.getAll = getAll;
Repository.prototype.getById = getById;

function getAll(callback) {
  var model = this.model;
  var query = model.find();
  query.exec(callback);
}

function getById(id, callback) {
  var model = this.model;
  var query = model.findOne({
    _id: id
  });
  query.exec(callback);
}

module.exports = Repository;
