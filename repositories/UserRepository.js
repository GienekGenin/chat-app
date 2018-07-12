const connection = require("../db/dbconnect");
const Repository = require("./generalRepository");
const User = require("../models/user");

function UserRepository() {
    Repository.prototype.constructor.call(this);
    this.model = User;
    this.getById = getById;
    this.getByIds = getByIds;
    this.removeById = removeById;
    this.update = update;
}

UserRepository.prototype = new Repository();

function getById(id, callback) {
    let model = this.model;
    let query = model.findOne({
        id: id
    });
    query.exec(callback);
}

function getByIds(ids, callback) {
    let model = this.model;
    console.log(ids, 'ids');
    let query = model.find({id: {$in: ids}});
    query.exec(callback);
}

function removeById(id, callback) {
    let model = this.model;
    let query = model.deleteOne({
        id: id
    });
    query.exec(callback);
}

function update(obj, callback) {
    let model = this.model;
    let query = model.update({id: obj.id}, {'name': obj.name, 'email': obj.email});
    query.exec(callback);
}

module.exports = new UserRepository();
