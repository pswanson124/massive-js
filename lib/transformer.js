var _ = require("underscore")._;

exports.first = function(record){

  var result;
  if (_.isArray(record)) {
    if (record.length > 0) { result = record[0]; }
  } else {
    result = record;
  }

  return result;
};

//A simple helper function to manage document ids
exports.formatArray = function(args){

  var result = [];
  _.each(args, function(doc){
    result.push(this.formatDocument(doc));
  }.bind(this));
  return result;
};

exports.formatDocument = function(args){
  var returnDoc = null;
  if(args){
    returnDoc = args.body || {};
    returnDoc.id = args.id || null;
  }
  return returnDoc;
};