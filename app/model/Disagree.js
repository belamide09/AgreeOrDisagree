var seq = require('sequelize');

// set connection
var con = new seq('nodepractice', 'root', '');

exports.connection = con;

var Disagree = con.define('disagrees', {
  id:{
    type : seq.INTEGER,
    primaryKey : true,
    autoIncrement : true
  },
  topic_id: seq.INTEGER,
  user_id	: seq.INTEGER,
  created	: seq.STRING,
  created_ip: seq.STRING
},
{timestamps : false});

module.exports = (function(){

  var X = {};

  X.Add = function(data,callback){
    Disagree.create(data).then(function(result,err){
      callback({
        error: err == 1 ? 'Failed to agree topic' : 0,
        result: result
      });
    });
  }

  X.Delete = function(data,callback){
    Disagree.destroy({
      where: {
        topic_id: data.topic_id,
        user_id: data.user_id
      }
    });
  }

  return X;
})();