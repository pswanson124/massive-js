var _ = require("underscore")._;
var util = require('util');
var Entity = require('./entity');

/**
 * An executable function or script.
 */
var Executable = function(args) {
  Entity.apply(this, arguments);

  this.sql = args.sql;
  this.filePath = args.filePath;
};

util.inherits(Executable, Entity);

Executable.prototype.invoke = function(params, opts, next) {

  next = _.isFunction(params) ? params : (_.isFunction(opts) ? opts : (_.isFunction(next) ? next : null));
  opts = (_.isObject(params) && !_.isArray(params) && !_.isFunction(params)) ? params : !_.isFunction(opts) ? opts : {};
  params = _.isFunction(params) ? [] : (_.isNull(params) || _.isUndefined(params) ? [] : (_.isArray(params) ? params : (!_.isObject(params) ? params : [])));

  // just to be sure:
  if (!_.isArray(params)) {
    params = [params];
  }

  if(!opts) { 
    opts = {};
  }

  if (opts.stream) {
    if(next) { 
      // there's a callback - execute normally:
      this.db.stream(this.sql, params, null, next);
    } else { 
      // THIS DOESN"T WORK AT THE MOMENT - streams and promises don't mix well - HELP!
      // the caller expects a promise - call the stream method accordingly:
      return this.db.stream(this.sql, params, null);
    }
  } else {
    if(next) { 
      // there's a callback - execute normally:
      this.db.query(this.sql, params, null, next);
    } else { 
      // this was invoked as a promise . . .
      return this.db.query(this.sql, params, null);
    }
  }
};

module.exports = Executable;
