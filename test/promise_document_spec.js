var helpers = require("./helpers");


describe('documents with promises', function() {

  var db;

  before(function(done) {
    helpers.resetDb(function(err,res) {
      db = res;
      done();
    });
  });

  describe('Querying documents', function () {
    // it('returns all documents when passed "*"', function () {
    //   return db.docs.findDoc("*");
    // });
    it('returns all documents when passed only "next" function', function () {
      return db.docs.findDoc();
    });
    it('finds a doc by primary key', function () {
      return db.docs.findDoc(1);
    });
    it('finds a doc with > comparison on primary key', function () {
      return db.docs.findDoc({"id >" : 1});
    });
    it('finds a doc with >= comparison on primary key', function () {
      return db.docs.findDoc({"id >=" : 2});
    });
    it('finds a doc by title', function () {
      return db.docs.findDoc({title : "A Document"});
    });
    it('parses greater than with two string defs', function () {
      return db.docs.findDoc({"price >" : "18"});
    });
    it('parses greater than with a numeric', function () {
      return db.docs.findDoc({"price >" : 18});
    });
    it('parses less than with a numeric', function () {
      return db.docs.findDoc({"price <" : 18});
    });
    it('deals with arrays using IN', function () {
      return db.docs.findDoc({"price" : [18, 6]});
    });
    it('deals with arrays using NOT IN', function () {
      return db.docs.findDoc({"price <>" : [18, 6]});
    });
    it('executes a contains if passed an array of objects', function () {
      return db.docs.findDoc({studios : [{name : "Warner"}]});
    });
    it('works properly with dates', function () {
      return db.docs.findDoc({"created_at <" : new Date(1980, 1,1)});
    });
  });
  describe('Full Text Search', function () {
    it('works on single key', function () {
      return db.docs.searchDoc({
        keys : ["title"],
        term : "Starsky"
      });
    });
    it('works on multiple key', function () {
      return db.docs.searchDoc({
        keys : ["title", "description"],
        term : "Starsky"
      });
    });
    it('returns multiple results', function () {
      return db.docs.searchDoc({
        keys : ["title"],
        term : "Document"
      });
    });
    it('returns properly formatted documents with id etc', function () {
      return db.docs.searchDoc({
        keys : ["title", "description"],
        term : "Starsky"
      });
    });
  });
});

