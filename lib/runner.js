var pg = require("pg");
var fs = require("fs");
var assert = require("assert");
var _ = require("underscore")._;
var ArgTypes = require("./arg_types");
var QueryStream = require('pg-query-stream');
var Promise = require("bluebird");

//Prototype for the DB namespace
var DB = function(connectionString){
  assert.ok(connectionString, "Need a connection string");
  this.connectionString = connectionString;
};


DB.prototype.stream = function () {
  //we expect sql, options, params and a callback
  var args = ArgTypes.queryArgs(arguments);

  //check to see if the params are an array, which they need to be
  //for the pg module
  if(_.isObject(args.params)){
    //we only need the values from the object,
    //so swap it out
    args.params = _.values(args.params);
  }

  //weird param bug that will mess up multiple statements
  //with the pg_node driver
  if(args.params === [{}]) args.params = [];
  var cs = this.connectionString;
  if(args.next){
    execStream(cs,args.sql, args.params, args.next);
  }else{
    return new Promise(function(resolve, reject){
      execStream(cs,args.sql, args.params, function(err, res){
        if(err) { 
          reject(err);
        } else { 
          resolve(res);
        }
      });
    });
  }
};

//convenience function
DB.prototype.executeSqlFile = function(args,next){
  var self = this;
  var fileSql = fs.readFileSync(args.file, {encoding: 'utf-8'});
  self.query({sql:fileSql, params: args.params, next: next});
};

// close connections immediately
DB.prototype.end = function(){
  pg.end();
};

var execStream = function(connectionString, sql, params, next){
  pg.connect(connectionString, function (err, db, done) {
    //throw if there's a connection error
    assert.ok(err === null, err);

    var query = new QueryStream(sql, params);

    var stream = db.query(query);

    stream.on('end', done);

    next(null, stream);
  });
};



DB.prototype.query = function () {
  //we expect sql, options, params and a callback
  var args = ArgTypes.queryArgs(arguments);

  //check to see if the params are an array, which they need to be for the pg module
  if(_.isObject(args.params)){
    //we only need the values from the object,
    //so swap it out
    args.params = _.values(args.params);
  }

  //weird param bug that will mess up multiple statements with the pg_node driver
  if(args.params === [{}]) args.params = [];
  var cs = this.connectionString;

  if(args.next){
    exec(cs, args.sql, args.params, args.options, args.next);
  }else{
    return new Promise(function(resolve, reject){
      exec(cs, args.sql, args.params, args.options, function(err,res){
        if(err){
          reject(err);
        }else{
          resolve(res);
        }
      });
    });
  }
};

var exec = function(connectionString, sql, params, options, next){
  var e = new Error();
  pg.connect(connectionString, function (err, db, done) {
    //throw if there's a connection error
    //assert.ok(err === null, err);
    if(err){
      done();
      next(err,null);
    }else{
      db.query(sql, params, function (err, result) {
        //we have the results, release the connection
        done();

        if (err) {
          //DO NOT THROW if there's a query error
          //bubble it up
          //handle if it's that annoying parameter issue
          //wish I could find a way to deal with this
          if (err.toString().indexOf("there is no parameter") > -1) {
            e.message = "You need to wrap your parameter into an array";
          } else {
            e.message = err.message || err.toString();
            e.code = err.code;
            e.detail = err.detail;
          }
          next(_.defaults(e, err), null);

        } else {
          //only return one result if single is sent in
          if (options.single) {
            result.rows = result.rows.length >= 0 ? result.rows[0] : null;
          }

          next(null, result.rows);
        }
      });
    }
  });
};

module.exports = DB;
