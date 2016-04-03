var massive = require("../index");
var assert = require("assert");
var helpers = require("./helpers");



describe('a promise-based connection', function () {
  it('connects using a promise', function () {
    return massive.connect({db: "massive"});
  });
});


describe('using promises', function () {
  var db;

  describe('basic table and query functions with promises', function() {
    before(function(done) {
      helpers.resetDb(function(err,res) {
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
      return db.saveDoc("doggies", {name : "Fido", age : 999});
    });
  });


  describe('promises with sql files', function () {

    before(function(done) {
      helpers.resetDb(function(err,res) {
        db = res;
        done();
      });
    });

    it('has an inStockProducts query attached', function () {
      assert(db.inStockProducts, "Not there");
    });
    it('executes a sql file with zero params', function () {
      db.inStockProducts()
      .then(function(products) { 
        assert.equal(2, products.length);
      });
    });
    it('executes productById with a primitive param', function () {
      return db.special.productById(1)
      .then(function(products) { 
          var p1 = products[0];
          assert.equal("Product 1", p1.name);
        });
    });
    it('executes productByName with multiple params', function () {
      return db.productByName(["Product 1", "Product 2"])
      .then(function(products) { 
        var p1 = products[0];
        var p2 = products[1];
        assert.equal("Product 1", p1.name);
        assert.equal("Product 2", p2.name);
      });
    });

  });


  describe('promises with functions', function () {

    before(function(done) {
      helpers.resetDb(function(err,res) {
        db = res;
        done();
      });
    });

    it("has an all_products function attached", function () {
      assert(db.all_products, "no all_products function");
    });

    it('executes all products', function () {
      return db.all_products()
      .then(function(res) { 
        assert(res.length > 0);
      });
    });
    it('executes all myschema.albums for a schema-bound function', function () {
      return db.myschema.all_albums()
        .then(function(res) { 
          assert(res.length > 0);
        });
      });
    it('executes artists with param', function () {
      return db.myschema.artist_by_name('AC/DC')
        .then(function(res) { 
          assert(res.length > 0);
        });
    });
  });


});

