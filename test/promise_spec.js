var assert = require("assert");
var massive = require("../index");

describe('a promise-based connection', function () {
  it('connects using a promise', function () {
    return massive.connect({db: "massive"});
  });
});


describe('using promises for queries', function () {
  var db;
  before(function(done){
    return massive.connect({db: "massive"}).then(function(res){
      db = res;
      done();
    });
  });
  it('will execute find', function () {
    return db.products.find();
  });
  it('will execute findOne', function () {
    return db.products.findOne();
  });
  it('executes count', function () {
    return db.products.count();
  });
  it('executes where', function () {
    return db.products.where("id > 0");
  });
  it('executes search', function () {
    return db.products.search({columns : ["name"], term: "Product"});
  });
  it('executes for insert', function () {
    return db.products.insert({name : "Gibson Les Paul", description : "Lester's brain child", price : 3500});
  });
  it('executes for update', function () {
    return db.products.update({in_stock: true}, {in_stock: false});
  });
  it('executes for destroy', function () {
    return db.products.destroy({id : 4});
  });
  it('executes for save', function () {
    return db.products.save({name : "Gibson Les Paul", description : "Lester's brain child", price : 3500});
  });
  it('executes for save', function () {
    return db.products.save({name : "Gibson Les Paul", description : "Lester's brain child", price : 3500});
  });
  it('executes for saving a document', function () {
    return db.saveDoc("puppies", {name : "Fido", age : 999});
  });

});

