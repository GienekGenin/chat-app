function Repository() {
}

Repository.prototype.getAll = getAll;
Repository.prototype.getById = getById;
Repository.prototype.removeById = removeById;
Repository.prototype.saveOne = saveOne;
Repository.prototype.update = update;

function getAll(callback) {
    let model = this.model;
    let query = model.find();
    query.exec(callback);
}

function getById(id, callback) {
    let model = this.model;
    let query = model.findOne({
        id: id
    });
    query.exec(callback);
}

function removeById(id, callback) {
    let model = this.model;
    let query = model.deleteOne({
        id: id
    });
    query.exec(callback);
}

function saveOne(obj, callback) {
    let model = this.model;
    model.create(obj);
    //delete findOne later
    let query = model.findOne({
        id: obj.id
    });
    query.exec(callback);
}

function update(obj, callback) {
    let model = this.model;
    let query = model.update({id: obj.id}, {'name': obj.name, 'email': obj.email});
    query.exec(callback);
}

module.exports = Repository;
