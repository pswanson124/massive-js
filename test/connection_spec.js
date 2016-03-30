var assert = require("assert");
var massive = require("../index");

describe('promise-based connection', function () {
  it('connect using a promise', function (done) {
    massive.connect({db: "massive"}).then(function(db){
      assert(db.tables);
      done();
    });
  });
});

describe('a regular cb connection', function () {
  it('will connect using a callback', function (done) {
    massive.connect({db: "massive"}, function(err, db){
      assert(db.tables);
      done();
    });
  });
});

describe('using promises for queries', function () {
  var db;
  before(function(done){
    massive.connect({db: "massive"}).then(function(res){
      db = res;
      done();
    });
  });
  it('will execute find', function (done) {
    db.products.find().then(function(res){
      assert(res);
      done();
    })
  });
  it('will execute findOne', function (done) {
    db.products.findOne().then(function(res){
      assert(res);
      done();
    })
  });
});