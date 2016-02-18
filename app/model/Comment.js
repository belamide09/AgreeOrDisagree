var seq = require('sequelize');

// set connection
var con = new seq('nodepractice', 'root', '');

exports.connection = con;

var Comment = con.define('comments', {
  id:{
    type : seq.INTEGER,
    primaryKey : true,
    autoIncrement : true
  },
  topic_id: seq.INTEGER,
  user_id	: seq.INTEGER,
  comment : seq.INTEGER,
  created	: seq.STRING,
  created_ip: seq.STRING,
  modified: seq.STRING,
  modified_ip: seq.STRING,
},
{timestamps : false});

module.exports = (function(){

  var X = {};

  X.Add = function(data,callback){
  	Comment.create(data,function(result,err){
  		callback({
				error: err == 1?'Failed to add comment':0,
				result: result
			});
  	});
  }

  X.Update = function(data,callback){
  	Comment.Update(data,{
  		where: {id: data.id}
  	}).done(function(result,err){
  		callback({
				error: err == 1?'Failed to update comment':0,
				result: result
			});
  	});
  }

  X.Delete = function(id,callback){
  	Comment.destroy({
  		where: {id:id}
  	}).done(function(){
  		callback(true);
  	});
  }

  return X;
})();
